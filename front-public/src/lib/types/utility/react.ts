export type ExtractExoticComponentProps<T> = T extends React.ForwardRefExoticComponent<infer P> ? P : T;
