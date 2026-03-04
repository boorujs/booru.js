import { DOMParser } from "@xmldom/xmldom";

const parser = new DOMParser();
export function parseXML(document: string) {
    const xml = parser.parseFromString(document).documentElement;

    // xmldom has yet to implement the children property

    // UPDATE: 0.9.9 will implement a ParentNode.children getter
    // update dependency as soon as possible
    // https://github.com/xmldom/xmldom/pull/960
    
    // for now just implement it ourselves
    setChildren(xml);
    
    function setChildren(node: typeof xml) {
        (<any> node.children) = Array.from(node.childNodes)
            .filter((element: any) => element.constructor.name === "Element");
        (<any> node.children as Array<typeof xml>)
            .forEach(setChildren);
    }

    return xml;
}
