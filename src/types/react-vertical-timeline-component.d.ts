// react-vertical-timeline-component v4 ships no type declarations, and
// @types/react-vertical-timeline-component targets v3. This covers the
// subset of the v4 API used here (see node_modules/.../src/*.js).
declare module "react-vertical-timeline-component" {
  import type { CSSProperties, ReactElement, ReactNode } from "react";

  export interface VerticalTimelineProps {
    animate?: boolean;
    className?: string;
    layout?: "1-column" | "1-column-left" | "1-column-right" | "2-columns";
    lineColor?: string;
    children?: ReactNode;
  }

  export interface VerticalTimelineElementProps {
    children?: ReactNode;
    className?: string;
    contentArrowStyle?: CSSProperties;
    contentStyle?: CSSProperties;
    date?: ReactNode;
    dateClassName?: string;
    icon?: ReactElement;
    iconClassName?: string;
    iconOnClick?: () => void;
    onTimelineElementClick?: () => void;
    iconStyle?: CSSProperties;
    id?: string;
    position?: string;
    style?: CSSProperties;
    textClassName?: string;
    visible?: boolean;
    shadowSize?: "small" | "medium" | "large";
    intersectionObserverProps?: {
      root?: Element | null;
      rootMargin?: string;
      threshold?: number;
      triggerOnce?: boolean;
    };
  }

  export function VerticalTimeline(props: VerticalTimelineProps): ReactElement;
  export function VerticalTimelineElement(
    props: VerticalTimelineElementProps,
  ): ReactElement;
}
