declare module '*.html' {
    const content: string;
    export default content;
}

type AppKey = HeadKey | FootKey | IIconKey;

type HeadKey = "hub" | "act" | "lib" | "bal" | "usr";
type FootKey = ActKey;

type ActKey = `act_${ActSection}`;
type ActSection = "us" | "them" | "ship" | "kids" | "bar" | "null";

type IIconKey = "file" | "folder" | "err";