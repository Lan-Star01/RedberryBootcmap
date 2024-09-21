import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedModalService {

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private originComponentSubject = new BehaviorSubject<string>('');
  private renderer: Renderer2;
  private agentAddedSource = new Subject<void>();

  isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();
  originComponent$: Observable<string> = this.originComponentSubject.asObservable();
  agentAdded$ = this.agentAddedSource.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  openModal(originComponent: 'main' | 'add-listing') {
    this.isOpenSubject.next(true);
    this.originComponentSubject.next(originComponent);
    this.addBackdrop();
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.isOpenSubject.next(false);
    this.removeBackdrop();
    document.body.classList.remove('modal-open');
  }

  isModalOpen(): boolean {
    return this.isOpenSubject.value;
  }

  getOriginComponent(): string {
    return this.originComponentSubject.value;
  }

  private addBackdrop() {
    const backdrop = this.renderer.createElement('div');
    this.renderer.addClass(backdrop, 'modal-backdrop');
    this.renderer.addClass(backdrop, 'fade');
    this.renderer.addClass(backdrop, 'show');
    this.renderer.appendChild(document.body, backdrop);
  }

  private removeBackdrop() {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      this.renderer.removeChild(document.body, backdrop);
    }
  }

  notifyAgentAdded() {
    this.agentAddedSource.next();
  }
  
}
