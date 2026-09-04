export function useWindowSize() {
  const [state, setState] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight
  });

  useEffect(() => {
    let rafId: number | null = null;

    const handler = () => {
      // Cancel any pending RAF to throttle updates
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      // Schedule update for next frame
      rafId = requestAnimationFrame(() => {
        setState({
          winWidth: window.innerWidth,
          winHeight: window.innerHeight
        });
        rafId = null;
      });
    };

    window.addEventListener("resize", handler);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("resize", handler);
    };
  }, []);

  return state;
}
