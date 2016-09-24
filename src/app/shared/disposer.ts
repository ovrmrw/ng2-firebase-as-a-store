import { Subscription } from 'rxjs/Subscription';


export abstract class Disposer {
  private subs: Subscription[] = [];

  protected set disposable(subscription: Subscription) {
    this.subs.push(subscription);
  }

  protected disposeSubscriptions(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  protected get subscriptionsCount(): number {
    return this.subs.length;
  }
}