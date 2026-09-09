import { memo, type CSSProperties } from "react";

const TITLE = "Une idée. Un algorithme.";
const START_DELAY_MS = 300;
const CHARACTER_DELAY_MS = 85;

/** CSS reveals the text without triggering a React render for each character. */
export default memo(function TypewriterTitle() {
  return (
    <h1 className="typewriter-title">
      <span className="sr-only">{TITLE}</span>
      <span aria-hidden="true">
        {TITLE.split(" ").map((word, wordIndex) => (
          <span key={wordIndex}>
            {wordIndex > 0 && " "}
            <span className="typewriter-word">
              {Array.from(word).map((character, index) => {
                const precedingCharacters = TITLE.split(" ")
                  .slice(0, wordIndex)
                  .join("").length;
                const delay =
                  START_DELAY_MS +
                  (precedingCharacters + index) * CHARACTER_DELAY_MS;

                return (
                  <span
                    className="typewriter-character"
                    key={index}
                    style={
                      { "--character-delay": `${delay}ms` } as CSSProperties
                    }
                  >
                    {character}
                  </span>
                );
              })}
            </span>
          </span>
        ))}
      </span>
    </h1>
  );
});
