import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ConnectPictureToText from "../pages/ConnectPictureToText";
import LetterTracing from "../pages/LetterTracing";
import Number4 from "../pages/Number4";
import Number5 from "../pages/Number5";
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
  {
    path: "/number-4",
    element: <Number4 />,
  },
  {
    path: "/number-5",
    element: <Number5 />,
  },
]);
