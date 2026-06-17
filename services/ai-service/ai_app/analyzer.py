import re
import math
from collections import Counter


# Common AI hedge phrases and filler patterns
HEDGE_PHRASES = [
    'it is worth noting', 'it is important to note', 'it is worth mentioning',
    'importantly', 'furthermore', 'moreover', 'additionally', 'in conclusion',
    'in summary', 'to summarize', 'it should be noted', 'needless to say',
    'as previously mentioned', 'as mentioned earlier', 'it goes without saying',
    'first and foremost', 'last but not least', 'in today\'s world',
    'in the modern era', 'in recent years', 'with that being said',
    'that being said', 'having said that', 'at the end of the day',
    'when it comes to', 'it is clear that', 'it is evident that',
    'there is no doubt', 'without a doubt', 'undoubtedly', 'certainly',
    'delve into', 'dive into', 'shed light', 'in the realm of',
    'it\'s worth noting', 'take a closer look', 'in this article',
    'in this blog post', 'in this essay', 'we will explore',
    'we will discuss', 'let us explore', 'let\'s dive',
]

# Words humans use that AI rarely does naturally
HUMAN_MARKERS = [
    'honestly', 'actually', 'basically', 'literally', 'kind of',
    'sort of', 'i think', 'i feel', 'i believe', 'i noticed',
    'i realized', 'i found', 'to be honest', 'truth is',
    'funny thing', 'weird thing', 'the thing is',
]


def get_sentences(text):
    """Split text into sentences."""
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [s for s in sentences if len(s.split()) > 2]


def get_words(text):
    """Extract clean words from text."""
    words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
    return words


def compute_burstiness(sentences):
    """
    Burstiness measures variance in sentence length.
    High variance = more human-like writing.
    Low variance = uniform AI-like writing.
    Returns 0-1 where 1 = very bursty (human).
    """
    if len(sentences) < 3:
        return 0.5

    lengths = [len(s.split()) for s in sentences]
    mean = sum(lengths) / len(lengths)
    variance = sum((l - mean) ** 2 for l in lengths) / len(lengths)
    std_dev = math.sqrt(variance)

    # Coefficient of variation
    cv = std_dev / mean if mean > 0 else 0

    # CV > 0.5 is very bursty (human), < 0.2 is very uniform (AI)
    score = min(1.0, cv / 0.6)
    return round(score, 3)


def compute_vocabulary_diversity(words):
    """
    Type-Token Ratio — unique words / total words.
    Higher = more diverse vocabulary.
    AI tends to repeat similar words across a text.
    Returns 0-1 where 1 = very diverse.
    """
    if len(words) < 10:
        return 0.5

    unique = len(set(words))
    total = len(words)

    # Raw TTR drops with longer texts so we use root TTR
    rttr = unique / math.sqrt(total)

    # Normalize — typical range is 3-8 for most texts
    score = min(1.0, rttr / 7.0)
    return round(score, 3)


def compute_hedge_score(text_lower, words):
    """
    Count AI hedge phrases and filler words.
    More hedges = more AI-like.
    Returns 0-1 where 1 = very hedgy (AI).
    """
    if not words:
        return 0.0

    hedge_count = 0
    for phrase in HEDGE_PHRASES:
        hedge_count += text_lower.count(phrase)

    # Normalize by text length (per 100 words)
    per_100 = (hedge_count / len(words)) * 100

    # More than 3 per 100 words is very AI-like
    score = min(1.0, per_100 / 3.0)
    return round(score, 3)


def compute_human_marker_score(text_lower, words):
    """
    Count first-person and human conversational markers.
    More markers = more human-like.
    Returns 0-1 where 1 = very human.
    """
    if not words:
        return 0.5

    marker_count = 0
    for marker in HUMAN_MARKERS:
        marker_count += text_lower.count(marker)

    per_100 = (marker_count / len(words)) * 100
    score = min(1.0, per_100 / 2.0)
    return round(score, 3)


def compute_sentence_length_uniformity(sentences):
    """
    AI tends to write sentences of very similar length (15-25 words).
    Humans vary wildly — short punchy lines mixed with long ones.
    Returns 0-1 where 1 = very uniform (AI-like).
    """
    if len(sentences) < 3:
        return 0.5

    lengths = [len(s.split()) for s in sentences]
    mean = sum(lengths) / len(lengths)

    # Count sentences within tight range of mean (±4 words)
    in_range = sum(1 for l in lengths if abs(l - mean) <= 4)
    uniformity = in_range / len(lengths)

    return round(uniformity, 3)


def compute_punctuation_variety(text):
    """
    Humans use more varied punctuation — dashes, questions, exclamations.
    AI tends to use periods almost exclusively.
    Returns 0-1 where 1 = very varied (human).
    """
    total_sentences = len(re.findall(r'[.!?]', text))
    if total_sentences == 0:
        return 0.5

    questions = len(re.findall(r'\?', text))
    exclamations = len(re.findall(r'!', text))
    dashes = len(re.findall(r'—|--|\s-\s', text))
    ellipsis = len(re.findall(r'\.{3}|…', text))

    variety_count = questions + exclamations + dashes + ellipsis
    score = min(1.0, (variety_count / total_sentences) * 2)
    return round(score, 3)


def analyze_writing(text):
    """
    Main analysis function. Returns full breakdown.
    """
    if not text or len(text.strip()) < 50:
        return {
            'error': 'Text too short to analyze (minimum 50 characters)'
        }

    text_lower = text.lower()
    sentences = get_sentences(text)
    words = get_words(text)

    # Compute all metrics
    burstiness = compute_burstiness(sentences)
    vocab_diversity = compute_vocabulary_diversity(words)
    hedge_score = compute_hedge_score(text_lower, words)
    human_markers = compute_human_marker_score(text_lower, words)
    uniformity = compute_sentence_length_uniformity(sentences)
    punct_variety = compute_punctuation_variety(text)

    # Human signals (higher = more human)
    human_score = (
        burstiness * 0.25 +
        vocab_diversity * 0.20 +
        human_markers * 0.20 +
        punct_variety * 0.15 +
        (1 - uniformity) * 0.10 +
        (1 - hedge_score) * 0.10
    )

    # AI signals (higher = more AI)
    ai_score = 1 - human_score

    # Convert to percentages
    human_pct = round(human_score * 100)
    ai_pct = 100 - human_pct

    # Verdict
    if human_pct >= 75:
        verdict = 'Strongly human'
        verdict_color = 'green'
    elif human_pct >= 55:
        verdict = 'Likely human'
        verdict_color = 'green'
    elif human_pct >= 45:
        verdict = 'Mixed signals'
        verdict_color = 'yellow'
    elif human_pct >= 25:
        verdict = 'Likely AI-assisted'
        verdict_color = 'orange'
    else:
        verdict = 'Strongly AI-generated'
        verdict_color = 'red'

    return {
        'human_percent': human_pct,
        'ai_percent': ai_pct,
        'verdict': verdict,
        'verdict_color': verdict_color,
        'word_count': len(words),
        'sentence_count': len(sentences),
        'metrics': {
            'burstiness': {
                'score': burstiness,
                'label': 'Sentence variety',
                'description': 'How much sentence length varies',
                'human_signal': True,
            },
            'vocabulary_diversity': {
                'score': vocab_diversity,
                'label': 'Vocabulary diversity',
                'description': 'Ratio of unique words to total words',
                'human_signal': True,
            },
            'hedge_phrases': {
                'score': round(1 - hedge_score, 3),
                'label': 'Avoids AI filler',
                'description': 'Absence of common AI hedge phrases',
                'human_signal': True,
            },
            'human_markers': {
                'score': human_markers,
                'label': 'Personal voice',
                'description': 'First-person and conversational markers',
                'human_signal': True,
            },
            'punctuation_variety': {
                'score': punct_variety,
                'label': 'Punctuation variety',
                'description': 'Use of questions, dashes, exclamations',
                'human_signal': True,
            },
            'sentence_uniformity': {
                'score': round(1 - uniformity, 3),
                'label': 'Length variation',
                'description': 'Avoidance of uniform sentence lengths',
                'human_signal': True,
            },
        }
    }