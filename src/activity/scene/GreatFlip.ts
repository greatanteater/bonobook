import axios from "axios";

interface Json {
    count?: number;
}

export default class GreatFlip {
    private _jsonData: any = undefined;
    private pages: string[] = [];

    constructor() {
        this.initialize();
    }

    private async initialize() {
        await this.getJson();
        for (let i = 1; i < this._jsonData.count + 1; i++) {
            console.log("설사: " + i);
            this.pages.push(`${process.env.BASE_URL}book1/${i}.png`);
        }
    }

    private mutateJsonData(jsonData: Json) {
        this._jsonData = jsonData;
    }

    private async getJson() {
        const path = `${process.env.BASE_URL}book1/bookdata.json`;
        await axios.get(path)
            .then((response) => {
                this.mutateJsonData(response.data);
            })
            .catch((reason) => {
                console.log(reason);
            });
        this.test();
    }

    private async test() {
        if (this._jsonData !== undefined) {
            console.log("개똥설사: " + this._jsonData.count);
        } else {
            console.log("JSON 데이터가 없습니다.");
        }
    }

    private getPages() {
        return this.pages;
    }
}