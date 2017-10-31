import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';

import 'rxjs/add/operator/switchMap';

import { Deck } from './deck';
import { Card } from './card';
import { DataService } from './data.service';

@Component({
  selector: 'review',
  templateUrl: './review.component.html'
})

export class ReviewComponent implements OnInit {
  deck: Deck;
  dueCards: Card[];
  currentCard: number;
  answerHidden: boolean;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getDeck();
    this.currentCard = 0;
    this.answerHidden = true;
  }

  getDeck(): void {
    this.route.params
    .switchMap((params: Params) =>
      this.dataService.getDeck(+params['id']))
    .subscribe(deck => {
      this.deck = deck
      this.dueCards = this.getDueCards(deck);
      if (this.dueCards.length === 0) {
        this.router.navigate(['/menu/deck/', this.deck.id]);
      }
    });
  }

  getDueCards(deck: Deck): Card[] {
    return deck.cards.filter(card => card.is_due);
  }

  showAnswer(): void {
    this.answerHidden = false;
  }

  review(answerQuality: number): void {
    if (answerQuality < 3) {
      this.dataService.review(this.dueCards[this.currentCard].id, answerQuality);
      this.dueCards.push(this.dueCards[this.currentCard]);
    } else {
      this.dataService.review(this.dueCards[this.currentCard].id, answerQuality);
    }

    if (this.currentCard < this.dueCards.length-1) {
      this.answerHidden = true;
      this.currentCard += 1;
    } else {
      setTimeout(
        () => this.router.navigate(['/menu/deck', this.deck.id]),
        200
      );
    }
  }

  editCard(id: number): void {
    this.router.navigate(['/menu/edit-card/', id]);
  }

  deleteCard(id: number): void {
    this.router.navigate(['/menu/delete-card/', id]);
  }

}
