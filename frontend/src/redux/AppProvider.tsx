"use client";

import React from "react";
import store from "./store";
import { Provider } from "react-redux";
import { NextUIProvider } from "@nextui-org/react";

type Props = {
  children: React.ReactNode;
};

export default function AppProvider({ children }: Props) {
  return (
    <Provider store={store}>
      {" "}
      <NextUIProvider>{children}</NextUIProvider>
    </Provider>
  );
}
