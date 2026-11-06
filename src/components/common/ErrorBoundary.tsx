import { Component, type ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return this.props.fallback ?? <div className="p-8 text-center text-sm text-muted">This view isn't available on your device.</div>;
    return this.props.children;
  }
}
