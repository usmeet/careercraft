"""CareerCraft chat app. Run:  streamlit run app.py"""
import os
import streamlit as st

from bot_core import (CareerBot, read_upload, HELP, format_resume_reply,
                      format_compare_reply, looks_like_text_block)

st.set_page_config(page_title="CareerCraft Bot", page_icon="🎯")
st.title("🎯 CareerCraft Resume Bot")

if not (os.path.exists("role_model.pkl") and os.path.exists("tfidf.pkl")):
    st.error("role_model.pkl and tfidf.pkl not found. Run `python train.py Resume.csv` first "
             "(or copy the files from your notebook's Step 11 into this folder).")
    st.stop()


@st.cache_resource
def load_bot():
    return CareerBot()


bot = load_bot()

if "messages" not in st.session_state:
    st.session_state.messages = [{"role": "assistant",
                                  "content": "Hi! I compare your resume with a job description.\n\n" + HELP}]
    st.session_state.resume = None
    st.session_state.last_upload = None


def say(text):
    st.session_state.messages.append({"role": "assistant", "content": text})


def handle(text, from_upload=False):
    """Core chat logic shared by typed messages and uploads."""
    cmd = text.strip().lower()
    if cmd == "help":
        say(HELP); return
    if cmd == "new":
        st.session_state.resume = None
        say("Started over. Paste your resume (or upload a file)."); return
    if cmd == "jd":
        say("Okay, paste the new job description." if st.session_state.resume
            else "Paste your resume first."); return
    if not looks_like_text_block(text):
        say("That's a bit short. Please paste the full text (at least a few sentences), or type `help`."); return

    if st.session_state.resume is None or from_upload:
        st.session_state.resume = text
        say(format_resume_reply(bot.top_roles(text), bot.top_roles(text)[0][1] < 0.30))
    else:
        say(format_compare_reply(bot.compare(st.session_state.resume, text)))


with st.sidebar:
    st.header("Upload resume")
    up = st.file_uploader("PDF or TXT", type=["pdf", "txt"])
    if up is not None and st.session_state.last_upload != up.name:
        st.session_state.last_upload = up.name
        try:
            text = read_upload(up.name, up.getvalue())
            st.session_state.messages.append({"role": "user", "content": f"📎 Uploaded {up.name}"})
            handle(text, from_upload=True)
        except Exception as e:
            say(f"Couldn't read that file ({e}). Try pasting the text instead.")
    if st.button("Start over"):
        st.session_state.clear(); st.rerun()
    st.caption("Resume loaded ✅" if st.session_state.get("resume") else "No resume yet")

for m in st.session_state.messages:
    with st.chat_message(m["role"]):
        st.markdown(m["content"])

if prompt := st.chat_input("Paste your resume or job description..."):
    st.session_state.messages.append({"role": "user", "content": prompt[:1500] + ("..." if len(prompt) > 1500 else "")})
    handle(prompt)
    st.rerun()
