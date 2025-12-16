import { useMemo } from "react";
import { useLocation, useMatches, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui-kit/button";

export function BackButton() {
  const matches = useMatches();
  const navigate = useNavigate();
  const location = useLocation();

  const show = useMemo(() => {
    const lastMatch = matches[matches.length - 1];
    return (lastMatch?.handle as any)?.backButton;
  }, [matches]);

  const handleClick = () => {
    // Remove the last segment from the current pathname
    const segments = location.pathname.split("/").filter(Boolean);
    segments.pop(); // Remove last segment
    const parentPath = "/" + segments.join("/");
    navigate(parentPath);
  };

  if (!show) {
    return null;
  }

  return <Button onClick={handleClick}>Back</Button>;
}
