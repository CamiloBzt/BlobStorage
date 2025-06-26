import httpAdapter from "@/services/httpAdapter";
import { useCallback, useEffect } from "react";

const EVENT_NAMES = {
  GET_TOKEN: "get-token",
  SET_TOKEN: "set-token",
} as const;

interface TokenEvent extends CustomEvent {
  detail: string;
}

const useEvents = () => {
  const handleEventToken = useCallback((event: TokenEvent) => {
    if (event?.detail) {
      httpAdapter.setToken(event.detail);
    }
  }, []);

  useEffect(() => {
    const getCustomEvent = new CustomEvent(EVENT_NAMES.GET_TOKEN, {
      bubbles: true,
      cancelable: true,
    });

    setTimeout(() => {
      window.dispatchEvent(getCustomEvent);
    }, 0);
  }, []);

  useEffect(() => {
    const handleToken = (event: Event) => {
      handleEventToken(event as TokenEvent);
    };

    window.addEventListener(EVENT_NAMES.SET_TOKEN, handleToken);

    return () => {
      window.removeEventListener(EVENT_NAMES.SET_TOKEN, handleToken);
    };
  }, [handleEventToken]);
};

export default useEvents;
