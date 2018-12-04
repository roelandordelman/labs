---
layout: application
application_id: dbd0f116-edb3-11e4-8099-005056a71e3a
title: PoliMedia
menu: home
website_url: http://polimedia.nl
thumb_image: /uploads/polimedia_wide.png
poster_image: /uploads/polimedia_poster.png
description: "How do media cover political debates?"
project_id: dbd28102-edb3-11e4-8099-005056a71e3a
access: Open
github: 
status: [Completed]
themes: [Metadata & Context, Humanities]
tags: [LOD, Semantic Web, Digital Humanities, Government, Political Debates]
contenttypes: [Text]
requestauthentication: 
publications: 
- title: "Bringing parliamentary debates to the Semantic Web"
  url: http://ceur-ws.org/Vol-902/paper_6.pdf
blogposts: 
- title: "Polemici wint internationale wedstrijd Linkedup Challenge"
  url: http://www.beeldengeluid.nl/nieuws/201309/polimedia-wint-internationale-wedstrijd-linkedup-challenge
---

How do media cover political debates? Answering this question requires a cross-media analysis of the minutes of the political debates, newspaper articles & photos and radio bulletins. The PoliMedia project linked the minutes of the debates in the Dutch Parliament (Dutch Hansard) to the databases of historical newspapers and ANP radio bulletins to allow cross-media analysis of coverage in a uniform search interface. 

For each fragment from a single speaker in a debate, relevant information was extracted: the speaker, the date, important terms from its content and important terms from the description of the complete debate. This information was then combined to create a query used to search the archive data. Media items that corresponded to this query were retrieved and a link was created between the speech and the media item, creating a Semantic Web of Dutch Hansard and media coverage. This Semantic Web contains links from the Dutch Hansard to newspaper articles and radio bulettins. In the faceted search interface the Dutch parliamentary minutes can be searched in full-text and refinements can be performed based on the speaker, the role of the speaker (parliament of government), political party and year. These debates are presented with links to the original locations of the media items. 

The [National Library of the Netherlands](http://www.kb.nl/en) provided all data. The linked open dataset is published as a [Sparql Endpoint](http://data.polimedia.nl).
