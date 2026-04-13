"use client";

import { Component, ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

/**
 * Class-based error boundary for R3F Canvas scenes.
 *
 * When a WebGL / shader / scene error occurs, swallows the throw and renders
 * a static gradient fallback so the rest of the page stays interactive.
 * Without this, any R3F crash bubbles up to the nearest Next.js error.tsx
 * and the entire route goes to the "Something broke" screen.
 */
export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Log for the dev console. In production this is just a safety net.
    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn("[R3F SceneErrorBoundary] caught error:", error.message);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.02]"
          />
        )
      );
    }
    return this.props.children;
  }
}
