import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ConnectPictureToText from "../pages/ConnectPictureToText";
import LetterTracing from "../pages/LetterTracing";
import GameLayout from "../layouts/GameLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    element: <GameLayout />,
    children: [
      {
        path: "/connect-picture-to-text",
        element: <ConnectPictureToText />,
      },
      {
        path: "/letter-tracing",
        element: <LetterTracing />,
      },
    ],
  },
]);
