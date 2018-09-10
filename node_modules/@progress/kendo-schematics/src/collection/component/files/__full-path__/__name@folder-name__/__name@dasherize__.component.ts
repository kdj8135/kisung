import { Component, OnInit<% if(!!viewEncapsulation) { %>, ViewEncapsulation<% }%> } from '@angular/core';

@Component({
  selector: '<%= selector %>',<% if(inlineTemplate) { %>
  template: `
    <%= templateContent %>
  `<% } else { %>
  templateUrl: './<%= dasherize(name) %>.component.html',<% } if(inlineStyle) { %>
  styles: [] <% } else { %>
  styleUrls: ['./<%= dasherize(name) %>.component.<%= styleext %>']<% } %> <% if(!!viewEncapsulation) { %>,
  encapsulation: ViewEncapsulation.<%= viewEncapsulation %> <% } %><% if (changeDetection !== 'Default') { %>,
  changeDetection: ChangeDetectionStrategy.<%= changeDetection %> <% } %>
})
export class <%= classify(name) %>Component implements OnInit {
  constructor() { }

  public ngOnInit(): void {
  }
}
