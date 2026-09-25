import { Component } from "react";

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("SplitNest UI Error:", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f7f8fc" }}>
        <section style={{ width: "min(680px, 100%)", background: "white", borderRadius: 18, padding: 28, boxShadow: "0 18px 50px rgba(29, 33, 68, .12)" }}>
          <h1 style={{ marginTop: 0 }}>SplitNest could not open</h1>
          <p>The page hit a frontend error. Open the browser console or copy the message below.</p>
          <pre style={{ whiteSpace: "pre-wrap", background: "#fff2f2", padding: 16, borderRadius: 12, color: "#a32121" }}>
            {this.state.error?.message || String(this.state.error)}
          </pre>
          <button type="button" onClick={() => window.location.assign("/")} style={{ border: 0, borderRadius: 10, padding: "12px 18px", cursor: "pointer" }}>
            Return Home
          </button>
        </section>
      </main>
    );
  }
}

export default AppErrorBoundary;
