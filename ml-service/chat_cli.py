"""Terminal version of the bot:  python chat_cli.py resume.txt jd.txt"""
import sys
from bot_core import CareerBot, read_upload, format_resume_reply, format_compare_reply

if len(sys.argv) != 3:
    sys.exit("usage: python chat_cli.py <resume.pdf|txt> <job_description.txt>")

bot = CareerBot()
resume = read_upload(sys.argv[1], open(sys.argv[1], "rb").read())
jd = read_upload(sys.argv[2], open(sys.argv[2], "rb").read())
r = bot.compare(resume, jd)
print(format_resume_reply(r["resume_roles"], r["low_confidence"]).replace("\nNow paste a **job description** to compare.", ""))
print()
print(format_compare_reply(r))
