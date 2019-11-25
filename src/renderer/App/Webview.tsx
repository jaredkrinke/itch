import React, { useContext, useRef, useEffect, useState } from "react";
import styled, { animations } from "renderer/styles";
import IconButton from "renderer/basics/IconButton";
import { SocketContext } from "renderer/Route";
import { packets } from "packets";
import { WebviewTag } from "electron";

const WebviewContainer = styled.div`
  width: 100%;
  height: 100%;

  webview {
    width: 100%;
    height: 100%;
  }
`;

const NavDiv = styled.div`
  color: ${props => props.theme.baseText};

  display: flex;
  flex-direction: column;
`;

const TitleBar = styled.div`
  font-size: 16px;

  height: 36px;
  line-height: 36px;
  vertical-align: middle;

  padding: 0 10px;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 10px;
  position: relative;
  overflow: hidden;

  .loader-inner {
    position: absolute;
    height: 2px;
    bottom: 2px;
    left: 0;
    right: 0;
  }

  &.loading {
    .loader-inner {
      background: repeating-linear-gradient(
        to right,
        transparent 0%,
        transparent 30%,
        ${props => props.theme.accent} 30%,
        ${props => props.theme.accent} 70%,
        transparent 70%,
        transparent 100%
      );
      animation: ${animations.horizontalIndeterminate} 2.4s ease-in-out infinite;
    }
  }
`;

const AddressBar = styled.div`
  border: 1px solid ${props => props.theme.inputBorder};
  padding: 0 10px;

  border-radius: 2px;
  height: 36px;
  line-height: 36px;
  vertical-align: middle;

  flex-grow: 1;
  max-width: 600px;
`;

interface NavigationProps {
  viewRef: React.RefObject<WebviewTag>;
  url: string;
  title: string;
  loading: boolean;
}

export const Navigation = (props: NavigationProps) => {
  const { title, url, loading } = props;
  let withWebview = (f: (wv: WebviewTag) => void) => (...args: any[]) => {
    if (props.viewRef.current) {
      f(props.viewRef.current);
    }
  };

  return (
    <NavDiv>
      <TitleBar>{title}</TitleBar>
      <Controls className={loading ? "loading" : ""}>
        <IconButton
          onClick={withWebview(wv => wv.goBack())}
          icon="arrow-left"
        />
        <IconButton
          onClick={withWebview(wv => wv.goForward())}
          icon="arrow-right"
        />
        <IconButton onClick={withWebview(wv => wv.reload())} icon="repeat" />
        <AddressBar>{url}</AddressBar>
        <div className="loader-inner"></div>
      </Controls>
    </NavDiv>
  );
};

export const Webview = () => {
  const socket = useContext(SocketContext);
  const viewRef = useRef<WebviewTag>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const wv = viewRef.current;
    if (wv) {
      wv.addEventListener("load-commit", ev => {
        if (ev.isMainFrame) {
          setUrl(ev.url);
        }
      });
      wv.addEventListener("page-title-updated", ev => {
        setTitle(ev.title);
      });
      wv.addEventListener("did-start-loading", ev => {
        setLoading(true);
      });
      wv.addEventListener("did-stop-loading", ev => {
        setLoading(false);
      });
    }
  }, [viewRef]);

  useEffect(() => {
    if (socket) {
      return socket.listen(packets.navigate, ({ href }) => {
        let wv = viewRef.current;
        if (wv) {
          wv.loadURL(href);
        }
      });
    }
    return undefined;
  }, [socket]);

  return (
    <WebviewContainer>
      <Navigation viewRef={viewRef} title={title} url={url} loading={loading} />
      <webview src="itch://library" ref={viewRef} />
    </WebviewContainer>
  );
};
