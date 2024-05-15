import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Card } from "../../card/state/card.model";
import { GroupList } from "../../group-list/state/group-list.model";
import { sameValueValidator } from "../validators/same-value-validator";

@Injectable({ providedIn: "root" })
export class FormsService {

  constructor(private readonly builder: FormBuilder) {
  }

  public createCardForm(initialValues: Partial<Card>): FormGroup {
    return this.builder.group({
      cardName: [
        initialValues?.name ?? '', [
          Validators.required,
          Validators.maxLength(300)
        ]
      ],
      groupId: [
        initialValues?.groupId ?? '', [
          Validators.required
        ]
      ],
      priorityId: [
        initialValues?.priorityId ?? '', [
          Validators.required
        ]
      ],
      description: [
        initialValues?.description ?? '', [
          Validators.maxLength(2000)
        ]
      ],
      dueDate: [
        initialValues?.dueDate ?? '', [
          Validators.required
        ]
      ]
    });
  }

  public createGroupListFrom(initialValues: Partial<GroupList>): FormGroup {
    let validators = [
      Validators.required,
      Validators.maxLength(300)
    ]

    if (initialValues.name) {
      validators.push(sameValueValidator(initialValues.name));
    }

    return this.builder.group({
      groupName: [
        initialValues.name,
        validators
      ]
    });
  }
}
