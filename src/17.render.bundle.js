exports.ids=[17,14],exports.modules={11:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=r(a(0)),u=r(a(2));function r(e){return e&&e.__esModule?e:{default:e}}var n=function(e){var t=e.article,a=e.user,u=e.onClick,r=e.addClassName;return a&&a.username&&t.author.username!==a.username?t.favorited?l.default.createElement("button",{className:"btn btn-sm btn-primary "+r,onClick:u},l.default.createElement("i",{className:"ion-heart"}),r?null:l.default.createElement("span",null," Unvorite Post")," ",l.default.createElement("span",{className:"counter"},t.favoritesCount)):l.default.createElement("button",{className:"btn btn-sm btn-outline-primary "+r,onClick:u},l.default.createElement("i",{className:"ion-heart"}),r?null:l.default.createElement("span",null," Favorite Post")," ",l.default.createElement("span",{className:"counter"},t.favoritesCount)):l.default.createElement("button",{className:"btn btn-sm btn-outline-primary "+r},l.default.createElement("i",{className:"ion-heart"}),r?null:l.default.createElement("span",null," Favorited count")," ",l.default.createElement("span",{className:"counter"},t.favoritesCount))};n.propTypes={article:u.default.shape().isRequired,user:u.default.shape().isRequired,onClick:u.default.func.isRequired,addClassName:u.default.string},t.default=n},20:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=c(a(0)),u=c(a(39)),r=a(4),n=c(a(2)),s=c(a(1)),d=a(30),i=c(a(11));function c(e){return e&&e.__esModule?e:{default:e}}var f=function(e){return l.default.createElement("div",{className:"article-preview"},l.default.createElement("div",{className:"article-meta"},l.default.createElement(s.default,{to:"/author/"+e.author.username},l.default.createElement("img",{alt:"☺",src:e.author.image})),l.default.createElement("div",{className:"info"},l.default.createElement(s.default,{to:"/author/"+e.author.username,className:"author"},e.author.username),l.default.createElement("span",{className:"date"},(0,u.default)(e.updatedAt).format("ddd MMM DD YYYY"))),l.default.createElement(i.default,{user:e.user,article:e,onClick:function(t){t.persist(),t.preventDefault(),e.user&&e.user.username&&e.user.username!==e.author.username&&e.dispatch((0,d.favorite)({slug:e.slug,method:e.favorited?"delete":"post"})),t.target.blur()},addClassName:"pull-xs-right"})),l.default.createElement(s.default,{to:"/"+e.slug,className:"preview-link"},l.default.createElement("h1",null,e.title),l.default.createElement("p",null,e.description),l.default.createElement("span",null,"Read more...")),l.default.createElement("div",null,l.default.createElement("ul",{className:"tag-list"},e.tagList.map(function(e){return l.default.createElement("li",{className:"tag-default tag-pill tag-outline",key:e},l.default.createElement(s.default,{to:"/tag/"+e},"#",e))}))))};f.propTypes={dispatch:n.default.func.isRequired,favorited:n.default.bool.isRequired,slug:n.default.string.isRequired,title:n.default.string.isRequired,description:n.default.string.isRequired,updatedAt:n.default.string.isRequired,author:n.default.shape({username:n.default.string,image:n.default.string}).isRequired,tagList:n.default.arrayOf(n.default.string).isRequired,user:n.default.shape({id:n.default.number,username:n.default.string}).isRequired},t.default=(0,r.connect)()(f)}};