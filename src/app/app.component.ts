import { Component } from "@angular/core";
import { Game } from "./game";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.sass"]
})
export class AppComponent {
    game: Game = new Game();
    humanMove(row: number, column: number) {
        this.game.humanMove(row, column);
    }
}
