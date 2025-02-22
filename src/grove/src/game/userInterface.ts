import { world } from "@grove/engine";

export type UserInterfaceData = {
    x: string,
    y: string,
    font: string,
    color: string,
    text: string
};

export class UserInterface {
    constructor(
        public x: string = '50%',
        public y: string = '50%',
        public font: string = '24px Arial',
        public color: string = 'white',
        public text: string = '',
    ) { }

    _DOMElement?: HTMLParagraphElement;
}

function createUIElement(data: UserInterface) {
    const div = document.createElement('div');
    const text = document.createElement('p');

    div.style.position = 'fixed';
    div.style.transform = 'translate(-50%, -50%)';
    text.style.textAlign = 'center';

    div.style.left = data.x;
    div.style.top = data.y;
    text.style.font = data.font;
    text.style.color = data.color;
    text.innerText = data.text;

    data._DOMElement = text;
    div.appendChild(data._DOMElement);
    document.body.appendChild(div);
}

/**
 * Delta: ()
 */
world.useEffect({
    type: UserInterface,

    add(entity, ui) {
        createUIElement(ui);
    },
});

/**
 * Delta: ()
 */
world.addRule({
    name: 'Update UI',
    group: [UserInterface],
    each_frame([uiData]) {
        uiData._DOMElement!.innerText = uiData.text;
    }
});