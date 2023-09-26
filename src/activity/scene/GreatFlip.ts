import axios from "axios";

interface Json {
  pagesCount: number;
}

export default class GreatFlip {
  private _jsonData: Json | null = null;
  private pages: string[] = [];
  private currentPage = 0;

  constructor () {
    this.currentPage = 1;
  }

  public async init() {
    await this.getJson();
    if (this._jsonData) {
      for (let i = 1; i < this._jsonData.pagesCount + 1; i++) {
        if (i == 1) {
            this.pages.push(''); 
        }
        const path = `${process.env.BASE_URL}book${this.currentPage}/${i}.png`;
        this.pages.push(path);
      }
    }
  }

  private mutateJsonData(jsonData: Json) {
    this._jsonData = jsonData;
  }

  private async getJson() {
    const path = `${process.env.BASE_URL}book${this.currentPage}/bookdata.json`;
    try {
      const response = await axios.get(path);
      this.mutateJsonData(response.data);
      this.test();
    } catch (reason) {
      console.log(reason);
    }
  }

  private async test() {
    if (this._jsonData !== null) {
      console.log("총 페이지: " + this._jsonData.pagesCount);
    } else {
      console.log("JSON 데이터가 없습니다.");
    }
  }

  public getPages() {
    console.log('"이미지 경로 로드 완료"');
    return this.pages;
  }
}
