from app.services.ai_matcher import AIMatcher


def test_extract_keywords_removes_stopwords_and_short_words():
    keywords = AIMatcher.extract_keywords("Eu sou um desenvolvedor de sistemas com Python")
    assert "python" in keywords
    assert "de" not in keywords
    assert "um" not in keywords


def test_parse_json_field_handles_json_list():
    assert AIMatcher.parse_json_field('["Python", "Django"]') == ["Python", "Django"]


def test_parse_json_field_handles_csv_fallback():
    assert AIMatcher.parse_json_field("Python, Django, SQL") == ["Python", "Django", "SQL"]


def test_parse_json_field_handles_empty():
    assert AIMatcher.parse_json_field(None) == []
    assert AIMatcher.parse_json_field("") == []


def test_skill_match_exact():
    score, matched = AIMatcher.calculate_skill_match(
        ["Python", "Django", "SQL"], ["Python", "Django"]
    )
    assert score == 100.0
    assert set(matched) == {"Python", "Django"}


def test_skill_match_fuzzy_recognizes_partial_names():
    # "Spring" no currículo deve casar com "Spring Boot" exigido pela vaga
    score, matched = AIMatcher.calculate_skill_match(["Spring", "Java"], ["Spring Boot", "Java"])
    assert score == 100.0


def test_skill_match_no_overlap():
    score, matched = AIMatcher.calculate_skill_match(["Marketing"], ["Python"])
    assert score == 0.0
    assert matched == []


def test_skill_match_empty_job_skills_returns_zero():
    score, matched = AIMatcher.calculate_skill_match(["Python"], [])
    assert score == 0.0


def test_text_similarity_identical_texts_scores_high():
    text = "Desenvolvedor Python com experiência em Django e APIs REST"
    score = AIMatcher.calculate_text_similarity(text, text)
    assert score > 90


def test_text_similarity_unrelated_texts_scores_low():
    resume = "Chef de cozinha especializado em confeitaria francesa"
    job = "Vaga para engenheiro de dados com Spark e Kafka"
    score = AIMatcher.calculate_text_similarity(resume, job)
    assert score < 20


def test_text_similarity_handles_empty_strings():
    assert AIMatcher.calculate_text_similarity("", "algo") == 0.0
    assert AIMatcher.calculate_text_similarity("algo", "") == 0.0


def test_calculate_compatibility_full_pipeline():
    resume_data = {
        "skills": '["Python", "Django", "SQL"]',
        "experience": '["Dev Python - 3 anos"]',
        "education": '["Ciencia da Computacao"]',
        "raw_text": "Desenvolvedor Python com experiencia em Django e APIs REST",
    }
    job_data = {
        "title": "Desenvolvedor Python",
        "description": "Vaga para desenvolvedor Python com Django e PostgreSQL",
        "skills_required": '["Python", "Django", "PostgreSQL"]',
        "requirements": "",
    }
    score, result = AIMatcher.calculate_compatibility(resume_data, job_data)
    assert 0 <= score <= 100
    assert result["breakdown"]["total_skills"] == 3
    assert "feedback" in result


def test_calculate_compatibility_score_bounded_at_100():
    data = {
        "skills": '["Python"]',
        "experience": "[]",
        "education": "[]",
        "raw_text": "Python Python Python",
    }
    job = {
        "title": "Python",
        "description": "Python Python Python",
        "skills_required": '["Python"]',
        "requirements": "",
    }
    score, _ = AIMatcher.calculate_compatibility(data, job)
    assert score <= 100
