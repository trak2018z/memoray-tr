import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from './data.service';

import { Deck } from './deck';

@Component({
  selector: 'add-deck',
  templateUrl: './add-deck.component.html'
})

export class AddDeckComponent implements OnInit {
  errorMessage: string;
  successMessage: string;

  deck: Deck;
  decks: Deck[];

  constructor(
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.deck = new Deck;
    this.getDecks();
  }

  getDecks(): void {
    this.dataService.getDecks()
    .then(decks => this.decks = decks);
  }

  createDeck(): void {
    this.successMessage = "";
    this.errorMessage = "";

    if (this.decks.find(deck => deck.name === this.deck.name)) {
      this.errorMessage = "Deck already exist.";
    } else {
      if (this.deck.name) {
        this.dataService.createDeck(this.deck);
        this.deck = new Deck;
        this.successMessage = "Deck added successfuly."
      } else {
        this.errorMessage = "Name cannot be left empty.";
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/menu/deck-list']);
  }
}
