import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const API_URL = 'http://localhost:5000';

const SAMPLE_NOTES = `An array is a collection of elements of the same data type stored in contiguous memory locations. Each element can be accessed using an index. In most programming languages, array indexing starts from zero. Arrays are useful for storing multiple values under a single variable name. Common operations include traversal, insertion, deletion, searching, and sorting.`;

function App() {
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateStudyPack = async () => {
    if (!notes.trim()) {
      setError('Please enter some study material first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/study-pack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: notes.trim(),
        }),
      });

      if (!response.ok) {
        let message = 'Failed to generate study pack.';

        try {
          const errorData = await response.json();
          message = errorData.error || errorData.message || message;
        } catch {
          // Keep default message
        }

        throw new Error(message);
      }

      const data = await response.json();

      setResult(data);
    } catch (err) {
      console.error('Study pack error:', err);

      if (err.message === 'Failed to fetch') {
        setError(
          'Unable to connect to the backend. Make sure the backend is running on port 5000.'
        );
      } else {
        setError(err.message || 'Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  const useSample = () => {
    setNotes(SAMPLE_NOTES);
    setResult(null);
    setError('');
  };

  const wordCount = notes.trim()
    ? notes.trim().split(/\s+/).length
    : 0;

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">SNAPSTUDY AI</p>

          <h1>
            quick revision.
          </h1>

          <p className="hero-text">
            Paste your study material and generate a summary,
            key points, keywords and practice questions in seconds.
          </p>
        </div>

        <div className="ai-card">
          <div className="ai-dot"></div>

          <h3>Powered by AI</h3>

          <p>
            AI-powered study material generation.
          </p>
        </div>
      </header>

      <main className="main-content">

        {/* LEFT SIDE */}
        <section className="panel input-panel">

          <div className="panel-header">
            <div>
              <h2>Study material</h2>
              <p>Paste your notes below</p>
            </div>

            <button
              className="secondary-button"
              onClick={useSample}
            >
              Use sample
            </button>
          </div>

          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setError('');
            }}
            placeholder="Paste your study material here..."
          />

          <div className="input-footer">
            <span>{wordCount} words</span>

            <button
              className="generate-button"
              onClick={generateStudyPack}
              disabled={loading}
            >
              {loading
                ? 'Generating...'
                : 'Generate Study Pack →'}
            </button>
          </div>

        </section>

        {/* RIGHT SIDE */}
        <section className="panel result-panel">

          {!loading && !result && !error && (
            <div className="empty-state">
              <div className="empty-icon">✦</div>

              <h2>Your study pack will appear here</h2>

              <p>
                Add your notes and click Generate Study Pack.
              </p>
            </div>
          )}

          {loading && (
            <div className="empty-state">
              <div className="loader"></div>

              <h2>Generating your study pack...</h2>

              <p>
                AI is analyzing your study material.
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="empty-state error-state">
              <div className="error-icon">⚠</div>

              <h2>Something went wrong</h2>

              <p>{error}</p>

              <button
                className="secondary-button retry-button"
                onClick={generateStudyPack}
              >
                Try again
              </button>
            </div>
          )}

          {result && !loading && !error && (
            <div className="results">

              {/* SUMMARY */}
              <div className="result-section">
                <div className="section-label">
                  SUMMARY
                </div>

                <h2>Quick Summary</h2>

                <p className="summary">
                  {result.summary}
                </p>
              </div>

              {/* KEY POINTS */}
              {result.points?.length > 0 && (
                <div className="result-section">
                  <div className="section-label">
                    KEY POINTS
                  </div>

                  <ul className="points-list">
                    {result.points.map((point, index) => (
                      <li key={index}>
                        <span className="bullet">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* KEYWORDS */}
              {result.keywords?.length > 0 && (
                <div className="result-section">
                  <div className="section-label">
                    KEYWORDS
                  </div>

                  <div className="keywords">
                    {result.keywords.map((keyword, index) => (
                      <span
                        className="keyword"
                        key={index}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* MCQs */}
              {result.mcqs?.length > 0 && (
                <div className="result-section">
                  <div className="section-label">
                    PRACTICE MCQs
                  </div>

                  <div className="questions">

                    {result.mcqs.map((mcq, index) => (
                      <div
                        className="question-card"
                        key={index}
                      >
                        <h3>
                          {index + 1}. {mcq.q}
                        </h3>

                        <div className="options">
                          {mcq.options?.map(
                            (option, optionIndex) => (
                              <div
                                className="option"
                                key={optionIndex}
                              >
                                <span>
                                  {String.fromCharCode(
                                    65 + optionIndex
                                  )}
                                </span>

                                {option}
                              </div>
                            )
                          )}
                        </div>

                        {typeof mcq.answer !== 'undefined' && (
                          <div className="answer">
                            Answer:{' '}
                            {typeof mcq.answer === 'number'
                              ? String.fromCharCode(
                                  65 + mcq.answer
                                )
                              : mcq.answer}
                          </div>
                        )}
                      </div>
                    ))}

                  </div>
                </div>
              )}

              {/* SHORT QUESTIONS */}
              {result.shortQuestions?.length > 0 && (
                <div className="result-section">
                  <div className="section-label">
                    SHORT QUESTIONS
                  </div>

                  <div className="short-questions">
                    {result.shortQuestions.map(
                      (question, index) => (
                        <div
                          className="short-question"
                          key={index}
                        >
                          <span>{index + 1}</span>

                          <p>{question}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

        </section>

      </main>

      <section className="how-section">
        <div>
          <p className="eyebrow">HOW IT WORKS</p>

          <h2>
            Turn long notes into quick revision material.
          </h2>
        </div>

        <div className="steps">

          <div className="step">
            <span>01</span>

            <h3>Paste</h3>

            <p>
              Add your class notes or study material.
            </p>
          </div>

          <div className="step">
            <span>02</span>

            <h3>Generate</h3>

            <p>
              AI analyzes your content and creates
              revision material.
            </p>
          </div>

          <div className="step">
            <span>03</span>

            <h3>Revise</h3>

            <p>
              Study using summaries, keywords and
              practice questions.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);