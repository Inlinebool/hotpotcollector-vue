# A User Study for QA Annotation Interfaces

Baseline Interface:

* Grouped by paragraph
* Show / hide paragraph
* Search for keywords, highlight occurrences and automatically hide unrelated paragraphs

Proposed interface:

* No group. Sentences ranked by relevance to the question.
* After each selection, update ranking by relevance to the question + selected sentences.

User operation and timestamps are recorded.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
