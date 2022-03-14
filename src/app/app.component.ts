import { Component, HostListener } from "@angular/core";
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
    @HostListener("document:keypress", ["$event"])
    handleKey({ key }: { key?: string }) {
        const number = Number(key) - 1;
        if (number >= 0 && number <= 8) {
            this.game.humanMoveByIndex(number);
        }
    }
}
