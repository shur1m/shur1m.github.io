from bs4 import BeautifulSoup


def extract_first_paragraph(html_content: str) -> str:
    soup = BeautifulSoup(html_content, "html.parser")
    paragraph = soup.find("p")
    if paragraph is None:
        return ""

    return paragraph.get_text(" ", strip=True)


def truncate_description(text: str, limit: int) -> str:
    normalized = " ".join(text.split())
    if len(normalized) <= limit:
        return normalized

    return normalized[: limit - 3].rstrip() + "..."
