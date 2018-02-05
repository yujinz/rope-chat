# rope-chat
This is a full-stack chat application with [my design of threaded messages](https://github.com/yujinz/rope-chat/blob/master/Proposal.pdf) implemenmted (work in progress). 

Frameworks and libraries: React, Node, MongoDB(mongojs), Socket.IO, styled-components.

## Helpful Resources
* Code Academy - Learn ReactJS: [Part I](https://www.codecademy.com/learn/react-101) & [Part II](https://www.codecademy.com/learn/react-102)
* [A simple messaging app with React Native and Socket.io](https://hackernoon.com/a-simple-messaging-app-with-react-native-and-socket-io-e1cae3df7bda)

## Progress
- [x] Basic chat platform that can save and display messages and usernames
- [x] Displaying a thread (by adding an icon with unique color before all of its messages)
- [x] Replying to a thread (by clicking the thread icon of a message so that the icon copied to the input area)
- [x] Creating a thread (by clicking the empty space before a message so that thread icon is generated both before that thread and in the input area)
- [ ] Deleting thread icon in the input area
- [ ] Filtered view of a certain thread
- [ ] Better thread icon (less color collision and use SVG)
- [ ] Better CSS
- [ ] Test and CI
- [ ] Demo