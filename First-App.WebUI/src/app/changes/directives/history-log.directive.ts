import {Directive, ElementRef, Input, Renderer2, SimpleChanges} from '@angular/core';
import { Change } from "../../common/models/change";

@Directive({
  selector: '[appHistoryLog]',
  standalone: true
})
export class HistoryLogDirective {
  @Input() change!: Change
  @Input() classForMain!: string
  @Input() classForMinor!: string;
  @Input() isCardHistory: boolean = false;

  constructor(private el: ElementRef,
              private renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.change || !this.classForMain || !this.classForMinor) {
      return;
    }

    this.renderer.setProperty(
      this.el.nativeElement,
      'innerHTML',
      this.getFormattedText()
    );
  }

  private getFormattedText() {
    let formatedText: string = "";
    if (this.isCardHistory) {
      return formatedText;
    } else {

      const mainEntityName = this.change.parameters
        .find(parameter => parameter.name === "MainEntityName")?.value;
      const relatedEntityName = this.change.parameters
        .find(parameter => parameter.name == "RelatedEntityName")?.value
      const previousValue = this.change.parameters
        .find(parameter => parameter.name === "PreviousValue")?.value;
      const newValue = this.change.parameters
        .find(parameter => parameter.name === "NewValue")?.value;

      switch (this.change.typeName) {
        case "CreateCard": {
          formatedText =
            `You added <span class="${this.classForMain}">${mainEntityName}</span> to <span class="${this.classForMinor}">${relatedEntityName}</span>`
          break;
        }
        case "DeleteCard": {
          formatedText =
            `You removed <span class="${this.classForMain}">${mainEntityName}</span> from <span class="${this.classForMinor}">${relatedEntityName}</span>`;
          break;
        }
        case "UpdateName": {
          formatedText =
            `You renamed <span class="${this.classForMain}">${previousValue}</span> to <span class="${this.classForMain}">${newValue}</span>`
          break;
        }
        case "UpdateDescription": {
          formatedText = `You updated description for <span class="${this.classForMain}">${mainEntityName}</span>`;
          break;
        }
        case "UpdateDueDate": {
          formatedText = `You changed due date for <span class="${this.classForMain}">${mainEntityName}</span> from <span class="${this.classForMinor}">${previousValue}</span> to <span class="${this.classForMinor}">${newValue}</span>`;
          break;
        }
        case "UpdatePriority": {
          formatedText = `You changed priority for <span class="${this.classForMain}">${mainEntityName}</span> from <span class="${this.classForMinor}">${previousValue}</span> to <span class="${this.classForMinor}">${newValue}</span>`;
          break;
        }
        case "UpdateGroup": {
          formatedText = `You moved <span class="${this.classForMain}">${mainEntityName}</span> from <span class="${this.classForMinor}">${previousValue}</span> to <span class="${this.classForMinor}">${newValue}</span>`;
          break
        }
        default: {
          formatedText = "occured error during formating";
          break;
        }
      }
    }
    return formatedText;
  }
}
