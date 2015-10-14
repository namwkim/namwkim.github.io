var app = angular.module('myApp', ['ngMaterial', 'ngSanitize'], function($interpolateProvider) {
          $interpolateProvider.startSymbol('<%');
          $interpolateProvider.endSymbol('%>');
      });
app.controller('AppCtrl', function($scope, $sce) {
  $scope.trustAsHtml = function(string) {
      return $sce.trustAsHtml(string);
  };
  $scope.badges = [
    {
      image: "/images/harvard.png",
      name: "Harvard",
      rowspan: 1,
      colspan: 1
    },  
    {
      image: "/images/adobe.png",
      name: "Adobe",
      rowspan: 1,
      colspan: 1
    },  
    {
      image: "/images/kaist.png",
      name: "KAIST",
      rowspan: 1,
      colspan: 1
    },  
    {
      image: "/images/lg.png",
      name: "LG",
      rowspan: 1,
      colspan: 1
    },  
    {
      image: "/images/samsung.png",
      name: "Samsung",
      rowspan: 1,
      colspan: 1
    },  
    {
      image: "/images/stanford.png",
      name: "Stanford",
      rowspan: 1,
      colspan: 1
    },  
    {
      image: "/images/stony.png",
      name: "Stony Brook",
      rowspan: 1,
      colspan: 1
    },  
    {
      image: "/images/iit.png",
      name: "IIT",
      rowspan: 1,
      colspan: 1
    },  
    {
      image: "/images/ajou.png",
      name: "Ajou",
      rowspan: 1,
      colspan: 1
    }

  ];
  $scope.news = [
    {
      msg: "Starting an internship at Adobe Creative Technologies Lab.",
      date: "May 27, 2015",
      location: "San Francisco, CA"
    },  
    {
      msg: "Attending the CHI 2015 conference.",
      date: "Apr 18-23, 2015",
      location: "Seoul, Korea"
    },
    {
      msg: "Factful received a Honorable Mention Award at CHI 2015.",
      date: "Mar 1, 2015"
    },
    {
      msg: "Our study on using mouse clicks as an alternative for eye-tracking accepted to CHI 2015 Works-in-Progress.",
      date: "Feb 13, 2015"
    },
    {
      msg: "BudgetWiser accepted to CHI 2015 Works-in-Progress and Workshop on Researching Gamification.",
      date: "Feb 13, 2015"
    },
    {
      msg: "Attended the IEEE VIS 2014 conference.",
      date: "Nov 9-14, 2014",
      location: "Paris, France"
    },
    {
      msg: "Started the CS PhD Program at Harvard SEAS.",
      date: "Sep 2, 2014",
      location: "Cambridge, MA"
    }    
  ];


  $scope.journalPapers = [
    {
      name: "Accurate Segmentation of Land Regions in Historical Cadastral Maps",
      link: "/files/JVCIR2014-MapSeg.pdf",
      author: "<strong>Nam Wook Kim</strong>, Jung Jin Lee, Hyungmin Lee, Jinwook Seo",
      source: "JVCIR 2014"
    }
  ];

  $scope.conferencePapers = [
    {
      name: "BudgetMap: Engaging Taxpayers in the Issue-Driven Classification of a Government Budget",
      link:  "",
      author: "Nam Wook Kim, Jonghyuk Jung, Eun-Young Ko, Songyi Han, Chang Won Lee, Juho Kim, and Jihee Kim",
      source: "CSCW 2016 (to appear)"
    },
    {
      name: "Beyond Memorability: Visualization Recognition and Recall",
      link:  "http://vcg.seas.harvard.edu/files/pfister/files/infovis_submission251-camera.pdf",
      author: "Michelle A. Borkin, Zoya Bylinskii, Nam Wook Kim, Constance May Bainbridge, Chelsea S. Yeh, Daniel Borkin, Hanspeter Pfister, and Aude Oliva.",
      source: "InfoVis 2015 (to appear)"
    },  
    {
      name: "Factful: Engaging Taxpayers in the Public Discussion of a Government Budget",
      link: "/files/CHI2015-Factful.pdf",
      author: "Juho Kim, Eun-Young Ko, Jonghyuk Jung, Chang Won Lee, <strong>Nam Wook Kim</strong>, Jihee Kim",
      source: "CHI 2015",
      note: "<mark><img src='images/honorable.png' style='width:20px'>Honorable Mention Award</img></mark>"
    },
    {
      name: "JigsawMap: Connecting the Past to the Future by Mapping Historical Textual Cadasters",
      link: "/files/CHI2012-JigsawMap.pdf",
      author: "Hyungmin Lee, Sooyun Lee, <strong>Nam Wook Kim</strong>, Jinwook Seo",
      source: "CHI 2012"
    },
    {
      name: "Social Visualization and Negotiation: Effects of Feedback Configuration and Status",
      link: "/files/CSCW2012-SocialVis.pdf",
      author: "Michael Nowak, Juho Kim, <strong>Nam Wook Kim</strong>, Clifford Nass",
      source: "CSCW 2012"
    },
    {
      name: "Tracing Genealogical Data with TimeNets",
      link: "/files/AVI2010-TimeNets.pdf",
      author: "<strong>Nam Wook Kim</strong>, Stuart K. Card, Jeffrey Heer",
      source: "AVI 2010"
    }
  ];

  
  $scope.otherPapers = [
    {
      name: "BudgetWiser: Gamification Design Opportunities in the Government Budget Domain",
      link: "/files/CHI2015-Workshop-BudgetWiser.pdf",
      author: "<b>Nam Wook Kim</b>, Jihee Kim, Juho Kim, Chang Won Lee, Eun-Young Ko, Jonghyuk Jung",
      source: "CHI 2015 Workshop on Researching Gamification",
      website: "http://budgetwiser.org/"
    },
    {
      name: "A Crowdsourced Alternative to Eye-tracking for Visualization Understanding",
      link: "/files/CHI2015-WIP-Bubble.pdf",
      author: "<strong>Nam Wook Kim</strong>, Zoya Bylinskii, Michelle A. Borkin, Aude Oliva, Krzysztof Z. Gajos, Hanspeter Pfister",
      source: "CHI 2015 Extended Abstracts",
      posterLink: "/files/CHI2015-WIP-Bubble-Poster.pdf",
      website: "https://study.namwkim.org/bubble/admin"
    },
    {
      name: "BudgetMap: Issue-Driven Navigation for a Government Budget",
      link: "/files/CHI2015-WIP-BudgetMap.pdf",
      author: "<strong>Nam Wook Kim</strong>, Chang Won Lee, Jonghyuk Jung, Eun-Young Ko, Juho Kim, Jihee Kim",
      source: "CHI 2015 Extended Abstracts",
      posterLink: "/files/CHI2015-WIP-BudgetMap-Poster.pdf"
    },

    {
      name: "Recording Reusable and Guided Analytics From Interaction Histories",
      link: "/files/VAST2013-ReGuide.pdf",
      author: "<strong>Nam Wook Kim</strong>",
      source: "VAST2013"
    },
    {
      name: "Vehicle Instrument Panel Design for Cooperative Driving ",
      link: "/files/ACHI2013-IWC.pdf",
      author: "<strong>Nam Wook Kim</strong>, Ji Tae Hong, Dae Ok Lee",
      source: "ACHI2013",
      posterLink: "/files/ACHI2013-IWC-Poster.pdf"
    },
    {
      name: "Connecting the Past to the Future - Visualizing and Mapping Textural Land-books",
      link: "http://hcil.snu.ac.kr/research/jigsawmap",
      author: "Hyungmin Lee, Sooyun Lee, <strong>Nam Wook Kim</strong>, Jinwook Seo",
      source: "Microsoft Faculty Summit 2011 DemoFest"
    }

  ];
  $scope.projects = [
    {
      name: "Data-Driven Guides",
      imgLink: "/images/projects/ddg.png",
      desc: "We are exploring a new approach to support designers to create infographics. \
      Our research question is how to help them to design creative and memorable infographics \
      without enforcing automatic data encoding and limiting the expressiveness of visual representations."
    },  
    {
      name: "A Crowdsourced Alternative to Eye-tracking",
      imgLink: "/images/projects/bubble.png",
      desc: "In this study we investigate the utility of using mouse clicks as an alternative for eye fixations in the \
      context of understanding data visualizations. We developed a crowdsourced study online to collect mouse clicks and \
      compared them with the fixation data from an eye-tracking experiment."
    },
    {
      name: "BudgetMap: Issue-Driven Budget Navigation",
      imgLink: "/images/projects/budgetmap.png",
      desc: "BudgetMap is an interactive tool for navigating budgets of government programs through a lens of social issues \
      of public interests. Its novel issuedriven approach can complement the traditional budget classification system used by \
       government organizations by addressing time-evolving public interests"
    }
  ];
});
