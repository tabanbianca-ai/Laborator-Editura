import ast
import re
from pathlib import Path


SOURCE = Path("tools/build_divaldo_translation.py")
OUT_SRT = Path("Divaldo_Franco_subtitrare_romana.srt")


def load_sections():
    tree = ast.parse(SOURCE.read_text(encoding="utf-8"))
    for node in tree.body:
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == "sections":
                    return ast.literal_eval(node.value)
    raise RuntimeError("Could not find sections in source file")


def parse_time(value):
    minutes, seconds = value.split(":")
    return int(minutes) * 60 + int(seconds)


def parse_range(value):
    start, end = value.split("-")
    return parse_time(start), parse_time(end)


def fmt_time(seconds):
    if seconds < 0:
        seconds = 0
    whole = int(seconds)
    millis = int(round((seconds - whole) * 1000))
    if millis == 1000:
        whole += 1
        millis = 0
    hours = whole // 3600
    minutes = (whole % 3600) // 60
    secs = whole % 60
    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"


def split_sentences(text):
    text = re.sub(r"\s+", " ", text).strip()
    parts = re.split(r"(?<=[.!?…”])\s+", text)
    return [part.strip() for part in parts if part.strip()]


def split_caption(sentence, max_len=82):
    words = sentence.split()
    chunks = []
    current = []
    length = 0
    for word in words:
        next_length = length + len(word) + (1 if current else 0)
        if current and next_length > max_len:
            chunks.append(" ".join(current))
            current = [word]
            length = len(word)
        else:
            current.append(word)
            length = next_length
    if current:
        chunks.append(" ".join(current))
    return chunks


def wrap_two_lines(text, max_line=42):
    words = text.split()
    if len(text) <= max_line:
        return text
    best = None
    for i in range(1, len(words)):
        left = " ".join(words[:i])
        right = " ".join(words[i:])
        score = abs(len(left) - len(right))
        if len(left) <= max_line + 8 and len(right) <= max_line + 8:
            if best is None or score < best[0]:
                best = (score, left, right)
    if best:
        return best[1] + "\n" + best[2]
    return text


def build_captions():
    sections = load_sections()
    captions = []
    for time_range, _heading, paragraphs in sections:
        start, end = parse_range(time_range)
        if time_range.endswith("21:54"):
            end = 21 * 60 + 53.65
        section_text = " ".join(paragraphs)
        chunks = []
        for sentence in split_sentences(section_text):
            chunks.extend(split_caption(sentence))
        total_chars = sum(max(len(chunk), 20) for chunk in chunks)
        section_duration = end - start
        cursor = float(start)
        for chunk in chunks:
            weight = max(len(chunk), 20) / total_chars
            duration = section_duration * weight
            duration = max(1.8, min(duration, 6.5))
            next_time = min(end, cursor + duration)
            if next_time - cursor < 0.8:
                continue
            captions.append((cursor, next_time, wrap_two_lines(chunk)))
            cursor = next_time
        if captions and captions[-1][1] < end:
            s, _e, text = captions[-1]
            captions[-1] = (s, end, text)
    return captions


def main():
    captions = build_captions()
    lines = []
    for index, (start, end, text) in enumerate(captions, start=1):
        lines.append(str(index))
        lines.append(f"{fmt_time(start)} --> {fmt_time(end)}")
        lines.append(text)
        lines.append("")
    OUT_SRT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT_SRT} with {len(captions)} captions")


if __name__ == "__main__":
    main()
