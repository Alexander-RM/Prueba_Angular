import { Component } from '@angular/core';

@Component({
  template: ''
})
export abstract class MaskUtilComponent {
  public static readonly Mask = Object.freeze({
    PHONE_NUMBER_MASK: '(00)-00-00-00-00'
  });

  public static readonly Size = Object.freeze({
    MIN_PEOPLE_NAME_SIZE: 2,
    MAX_PEOPLE_NAME_SIZE: 63,
    MIN_PEOPLE_LASTNAME_SIZE: 2,
    MAX_PEOPLE_LASTNAME_SIZE: 63,
    MIN_PEOPLE_SECONDLASTNAME_SIZE: 2,
    MAX_PEOPLE_SECONDLASTNAME_SIZE: 63,
    MIN_ADMIN_NAME_SIZE: 2,
    MAX_ADMIN_NAME_SIZE: 63,
    MIN_EMAIL_SIZE: 8,
    MAX_EMAIL_SIZE: 63,
    MIN_PHONE_SIZE: 10,
    MAX_PHONE_SIZE: 10,
    MIN_CONDNAME_SIZE: 2,
    MAX_CONDNAME_SIZE: 63,
    MIN_STREET_SIZE: 2,
    MAX_STREET_SIZE: 63,
    MIN_NUMBEREXT_SIZE: 2,
    MAX_NUMBEREXT_SIZE: 63,
    MIN_RFC_SIZE: 12,
    MAX_RFC_SIZE: 13,
    MIN_COMPANY_SIZE: 2,
    MAX_COMPANY_SIZE: 100,
  });
}
