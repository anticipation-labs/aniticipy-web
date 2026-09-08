import React from "react";
import { hydrateRoot } from "react-dom/client";
import { AnticipyLanding } from "../src/components/redesign/AnticipyLanding";

hydrateRoot(document.getElementById("root")!, <AnticipyLanding preview />);
