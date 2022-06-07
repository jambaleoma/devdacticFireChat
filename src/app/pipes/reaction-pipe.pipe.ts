import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reactionPipe'
})
export class ReactionPipePipe implements PipeTransform {

  reactionType: string;

  transform(value: unknown, ...args: unknown[]): unknown {
    this.reactionType = this.checkReactionType(value);
    return this.reactionType;
  }

  checkReactionType(value) {
    switch (value) {
      case 'ok':
        return '👍🏻'
        break;
      case 'love':
        return '❤️'
        break;
      case 'lol':
        return '😂'
        break;
      case 'wow':
        return '😮'
        break;
      case 'cry':
        return '😢'
        break;
      case 'sorry':
        return '🙏🏻'
        break;
    }
  }


}
