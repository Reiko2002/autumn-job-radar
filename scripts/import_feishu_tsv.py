from __future__ import annotations

import argparse
import csv
import hashlib
from pathlib import Path


CSV_FIELDS = [
    "external_id",
    "company",
    "title",
    "location",
    "job_type",
    "graduate_years",
    "published_at",
    "deadline_at",
    "source_url",
    "apply_url",
    "description",
    "industry_tags",
    "skill_tags",
    "enabled",
]

# 飞书表中也记录了少量外资/海外企业；v2 只展示国内企业。
EXCLUDED_COMPANIES = {"shoppe", "虾皮sea", "特斯拉", "宝马"}


def infer_skills(title: str) -> str:
    tags: list[str] = []
    lowered = title.lower()
    for keyword, tag in (
        ("ai", "AI"),
        ("大模型", "大模型"),
        ("产品", "产品"),
        ("运营", "运营"),
        ("管培", "管培"),
        ("海外", "国际化"),
        ("营销", "营销"),
        ("策略", "策略"),
    ):
        if keyword.lower() in lowered and tag not in tags:
            tags.append(tag)
    return "|".join(tags)


def convert(input_path: Path, output_path: Path) -> tuple[int, int]:
    rows: list[dict[str, str]] = []
    skipped = 0
    with input_path.open(encoding="utf-8", newline="") as source:
        for raw in csv.reader(source, delimiter="\t"):
            raw += [""] * (9 - len(raw))
            company, homepage, title, campaign, _progress, job_url, note, company_type, *_ = [
                value.strip() for value in raw
            ]
            company_key = company.lower().replace(" ", "")
            source_url = job_url if job_url.startswith(("http://", "https://")) else homepage
            if (
                not company
                or not title
                or not source_url.startswith(("http://", "https://"))
                or company_key in EXCLUDED_COMPANIES
            ):
                skipped += 1
                continue

            identity = f"{company}|{title}|{source_url}"
            external_id = "feishu-" + hashlib.sha1(identity.encode()).hexdigest()[:12]
            # progress 是维护者的私人求职跟进信息，绝不进入公开岗位数据。
            details = [f"招聘批次：{campaign}" if campaign else ""]
            details.append(f"备注：{note}" if note else "")
            rows.append(
                {
                    "external_id": external_id,
                    "company": company,
                    "title": title,
                    "location": "中国",
                    "job_type": "校招",
                    "graduate_years": "2026|2027",
                    "published_at": "",
                    "deadline_at": "",
                    "source_url": source_url,
                    "apply_url": source_url,
                    "description": "；".join(part for part in details if part),
                    "industry_tags": company_type or "国内企业",
                    "skill_tags": infer_skills(title),
                    "enabled": "true",
                }
            )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8", newline="") as target:
        writer = csv.DictWriter(target, fieldnames=CSV_FIELDS, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    return len(rows), skipped


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert a Feishu Bitable TSV export to job CSV")
    parser.add_argument("input", type=Path)
    parser.add_argument("--output", type=Path, default=Path("data/manual_jobs.csv"))
    args = parser.parse_args()
    imported, skipped = convert(args.input, args.output)
    print(f"Imported {imported} domestic jobs; skipped {skipped} incomplete/foreign rows")


if __name__ == "__main__":
    main()
