import type { PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavbarSearch } from "./hooks";

type ScrollbarMetrics = {
  thumbHeight: number;
  thumbTop: number;
};

type ScrollbarDragState = {
  startY: number;
  startScrollTop: number;
};

function getReleaseYear(firstReleaseDate?: number) {
  if (!firstReleaseDate) {
    return "TBD";
  }

  return new Date(firstReleaseDate * 1000).getUTCFullYear().toString();
}

export function NavbarSearch() {
  const resultsListRef = useRef<HTMLDivElement>(null);
  const scrollbarDragRef = useRef<ScrollbarDragState | null>(null);
  const [scrollbarMetrics, setScrollbarMetrics] = useState<ScrollbarMetrics>({
    thumbHeight: 100,
    thumbTop: 0,
  });
  const [hasScrollableResults, setHasScrollableResults] = useState(false);
  const {
    query,
    setQuery,
    results,
    isSearching,
    showResults,
    openGame,
  } = useNavbarSearch();
  const sortedResults = [...results].sort((firstGame, secondGame) => {
    if (!firstGame.first_release_date && secondGame.first_release_date) {
      return 1;
    }

    if (firstGame.first_release_date && !secondGame.first_release_date) {
      return -1;
    }

    return 0;
  });
  const shouldShowDropdown = showResults && sortedResults.length > 0;

  function updateScrollbarMetrics() {
    const resultsList = resultsListRef.current;

    if (!resultsList) {
      return;
    }

    const { clientHeight, scrollHeight, scrollTop } = resultsList;
    const canScroll = scrollHeight > clientHeight;

    setHasScrollableResults(canScroll);

    if (!canScroll) {
      setScrollbarMetrics({
        thumbHeight: 100,
        thumbTop: 0,
      });
      return;
    }

    const thumbHeight = Math.max((clientHeight / scrollHeight) * 100, 18);
    const maxThumbTop = 100 - thumbHeight;
    const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * maxThumbTop;

    setScrollbarMetrics({
      thumbHeight,
      thumbTop,
    });
  }

  function handleScrollbarPointerDown(event: PointerEvent<HTMLDivElement>) {
    const resultsList = resultsListRef.current;

    if (!resultsList) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);

    scrollbarDragRef.current = {
      startY: event.clientY,
      startScrollTop: resultsList.scrollTop,
    };
  }

  function handleScrollbarPointerMove(event: PointerEvent<HTMLDivElement>) {
    const resultsList = resultsListRef.current;
    const dragState = scrollbarDragRef.current;

    if (!resultsList || !dragState) {
      return;
    }

    const scrollRatio = resultsList.scrollHeight / resultsList.clientHeight;
    const pointerDelta = event.clientY - dragState.startY;

    resultsList.scrollTop = dragState.startScrollTop + pointerDelta * scrollRatio;
  }

  function handleScrollbarPointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    scrollbarDragRef.current = null;
  }

  useEffect(() => {
    updateScrollbarMetrics();
  }, [results.length, isSearching, showResults]);

  return (
    <div className="navbar-search">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="navbar-search-input"
        placeholder="Search"
        aria-label="Search games"
      />

      <svg
        className="navbar-search-icon"
        viewBox="0 0 512 512"
        aria-hidden="true"
      >
        <path d="M208 64a144 144 0 1 0 0 288 144 144 0 0 0 0-288ZM16 208a192 192 0 1 1 341 121l121 121a24 24 0 0 1-34 34L323 363A192 192 0 0 1 16 208Z" />
      </svg>

      {shouldShowDropdown && (
        <div className="navbar-search-dropdown">
          <div
            ref={resultsListRef}
            className="navbar-search-results-list"
            onScroll={updateScrollbarMetrics}
          >
            {sortedResults.map((game) => {
              const releaseYear = getReleaseYear(game.first_release_date);

              return (
                <button
                  key={game.id}
                  type="button"
                  className="navbar-search-result"
                  onClick={() => openGame(game)}
                >
                  <span className="navbar-search-result-name">
                    {game.name}
                  </span>

                  <span className="navbar-search-result-year">
                    ({releaseYear})
                  </span>
                </button>
              );
            })}

          </div>

          {hasScrollableResults && (
            <div className="navbar-search-scrollbar" aria-hidden="true">
              <div
                className="navbar-search-scrollbar-thumb"
                onPointerDown={handleScrollbarPointerDown}
                onPointerMove={handleScrollbarPointerMove}
                onPointerUp={handleScrollbarPointerEnd}
                onPointerCancel={handleScrollbarPointerEnd}
                style={{
                  height: `${scrollbarMetrics.thumbHeight}%`,
                  top: `${scrollbarMetrics.thumbTop}%`,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
