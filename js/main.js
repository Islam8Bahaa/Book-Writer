document.addEventListener("DOMContentLoaded", function() {
    // Global Variables
    let chapterList = document.querySelector(".chapter-list"),
    tag = false ;
        editorSection = document.querySelector(".editor-section"),
        chapterAccordion = document.querySelector(".accordion"),
        addBtn = document.querySelector(".add"),
        chapterContainerElement = document.querySelector(".chapters"),
        mobileView = window.innerWidth > 500 ? false : true,
        lettersCount = [
            [1, 0]
        ];

    class HeaderBlot extends Quill.import('blots/inline') {}
    HeaderBlot.blotName = 'header';
    HeaderBlot.tagName = ['h1' , 'h2'];

    Quill.register(HeaderBlot);

    // Custom module for applying header formatting
    const HeaderModule = function (quill, options) {
    let headerButton = options.container.querySelector('#header-button');
    headerButton.addEventListener('click', function () {
        let range = quill.getSelection();
        if (range) {
        quill.formatText(range.index, range.length, 'header', true);
        }
    });
    }

    let toolbarOptions = [
        [{
                header: 1,
            },
            {
                header: 2,
            },
            "bold",
            "italic",
            "underline",
            "blockquote",
            "code-block",
            {
                list: "bullet",
            },
            {
                list: "ordered",
            },
            {
                align: [],
            },
            "clean"

        ],
    ];

    
    

    if (mobileView) {
        let chapterAccordion1 = new Quill("#chapter-accordion-1 .editor", {
            modules: {
                toolbar: toolbarOptions,
            },
            theme: "snow",
        });
        chapterAccordion1.on("text-change", function() {
            let textLen = chapterAccordion1.getLength();
            for (let i = 0; lettersCount.length > i; i++) {
                if (lettersCount[i][0] == 1) {
                    lettersCount[i][1] = textLen;
                    break;
                }
            }
            calcChapters(lettersCount, true);
        });

    } else {
        let chapterEditor1 = new Quill("#chapter-editor-1 .editor", {
            modules: {
                toolbar: toolbarOptions,
                
            },
            placeholder: "It was a bright cold day in April, and the clocks were striking thirteen",
            theme: "snow",
        });


        chapterEditor1.on("text-change", function() {
            let textLen = chapterEditor1.getLength(),
                editorFullContent1 = document.querySelector(
                    "#chapter-editor-1 .ql-editor"
                ).innerHTML,
                previewContainer = document.querySelector(
                    "#chapter-preview-1 .chapterPreviewContainer"
                ),
                chapterTitle = document.querySelector("#chapter-title-1 input").value,
                oldDOM = [];
            let x = `<h1 class="cht" id="cht-1">${chapterTitle}</h1> </br></br></br></br></br></br>`
            editorFullContent = x + editorFullContent1;
            previewContainer.querySelectorAll(".preview").forEach(e => {
                let childrenLen = e.children.length,
                    i = 0;
                if (childrenLen > 0) {
                    for (i; childrenLen > i; i++) {
                        oldDOM.push(e.children[i]);
                    }
                }
            });
            let tmp = document.createElement('div');
            tmp.innerHTML = editorFullContent;
            let paragraphs = Array.from(tmp.children)
            let newContent = "";
            paragraphs.forEach(el => {
   let karim = el.firstElementChild; 


   if( karim == null ){ 
                if(el.tagName == "P" || el.tagName == "PRE"  ){  
                    let p =el ;
                    let sentences = p.innerHTML.split(" ");
                    let newParagraph = "";
                    let currentParagraph = "";
                    let currentParagraphLength = 0;
                    sentences.forEach(s => {
                        let sentenceLength = s.length;

                        let y = sentenceLength + currentParagraphLength;
                        console.log(y);
                        if (y < 49 ) {
                        currentParagraph += s + " ";
                        currentParagraphLength += sentenceLength + 1;
                        y = 0;
                        } else {
                        newParagraph += `<${el.tagName} class="${el.classList[0]}"> ` + currentParagraph + `</${el.tagName}>`;
                        currentParagraph = s + " ";
                        currentParagraphLength = sentenceLength + 1;
                        }
                    });
                    newParagraph += `<${el.tagName} class="${el.classList[0]}"> ` + currentParagraph + `</${el.tagName}>`;
                    newContent += newParagraph;
                }else{
                    newContent += el.outerHTML;
                }
            }else{
                console.log(el.innerHTML);
                newContent += el.outerHTML;
            }
            });
            // console.log(newContent);

          
            editorFullContent = newContent;
            // console.log(editorFullContent);

            previewContainer.innerHTML = "";

            appendChunksToPages(
                getNodeChunks(editorFullContent, oldDOM),
                previewContainer,
                chapterTitle
            );

            document.querySelectorAll(".chapter-pageNum").forEach((e, i) => {
                e.innerHTML = i + 1;
            });

            for (let i = 0; lettersCount.length > i; i++) {
                if (lettersCount[i][0] == 1) {
                    lettersCount[i][1] = textLen;
                    break;
                }
            }
            calcChapters(lettersCount);
        });
    }

    // Conditional Variables

    // add new chapter.
    addBtn.addEventListener("click", function() {
        let chapterTitleCount = document.querySelectorAll(".chapter-title").length;
        if (mobileView) {
            chapterTitleCount = document.querySelectorAll(".accordion-item").length;
        }
        let chapterID = Date.now();

        if (mobileView) {
            // Mobile functionality.
            chapterAccordion.insertAdjacentHTML(
                "beforeend",
                `  
      <div class="accordion-item rounded-0" id="chapter-accordion-${chapterID}" onclick="accordionClick(event)">
	  <div class="box d-flex align-items-center justify-content-between ">
          <h2 class="accordion-header align-items-center d-flex flex-row-reverse w-100" id="heading-${chapterID}" >
              <input class="accordion-button content px-1 rounded-0" type="text" data-bs-toggle="collapse"
                  data-bs-target="#collapse-${chapterID}" aria-expanded="true" aria-controls="collapse-${chapterID}"  placeholder="Add chapter title" />
              <span class="chapterNumber">${chapterTitleCount+1}.</span>
          </h2>
		  <div class="handl text-center accordion-header">
                                <i class="fa fa-angle-down a-down d-none" id="arrow-1"></i>
                            </div>
		  </div>
          <div class="progressbar-back">
              <div class="progressbar-val"></div>
          </div>    
          <div id="collapse-${chapterID}" class="accordion-collapse px-2 rounded-0 collapse show" aria-labelledby="heading-${chapterID}"
            data-bs-parent="#accordionContainer">
            <div class="accordion-body col-primary-dark">
              <div class="editor px-2"> </div>
            </div>
          </div>
      </div>
      `
            );


            let currentChapterTitle = document.getElementById(
                    "chapter-accordion-" + chapterID
                ),
                currentChapterTitleInput =
                currentChapterTitle.getElementsByTagName("input")[0];
            currentChapterTitleInput.focus();
            currentChapterTitleInput.click();
            currentChapterTitleInput.addEventListener("keyup", (event) => {
                if (event.keyCode === 13 || event.code === "Enter") {
                    currentChapterTitleInput.setAttribute("disabled", true);
                }
            });

            lettersCount[lettersCount.length] = [chapterID, 0];

            window["chapterEditor" + chapterID] = new Quill(
                "#chapter-accordion-" + chapterID + " .editor", {
                    modules: {
                        toolbar: toolbarOptions,
                    },
                    theme: "snow",
                }
            );
            window["chapterEditor" + chapterID].on(
                "text-change",
                function(delta, oldDelta, source) {
                    let textLen = window["chapterEditor" + chapterID].getLength();
                    for (let i = 0; lettersCount.length > i; i++) {
                        if (lettersCount[i][0] == chapterID) {
                            lettersCount[i][1] = textLen;
                            break;
                        }
                    }
                    calcChapters(lettersCount, true);
                }
            );

        } else {
            // desktop functionality.
            chapterList.insertAdjacentHTML(
                "beforeend",
                `  
      <div class="chapter-title" id="chapter-title-${chapterID}" data-chapter-num="${chapterID}">
        <div class="input_field">
            <div class="title d-flex align-items-center flex-row-reverse">
            <input class="content w-100" placeholder="Add chapter title" data-cid="${chapterID}" />
            <span class="chapterNumber">${chapterTitleCount+1}.</span>
            </div>
            <div class="icons">
              <i class="fa-solid fa-pen"></i>
              <i class="fa-solid fa-trash"></i>
            </div>
        </div>
        <div class="progressbar-back w-100">
            <div class="progressbar-val"></div>
        </div>
      </div>
      `
            );

            let currentChapterTitle = document.getElementById(
                    "chapter-title-" + chapterID
                ),
                currentChapterTitleInput =
                currentChapterTitle.getElementsByTagName("input")[0];
            currentChapterTitleInput.focus();
            currentChapterTitleInput.click();
            currentChapterTitleInput.addEventListener("keyup", (event) => {
                if (event.keyCode === 13 || event.code === "Enter") {
                    currentChapterTitleInput.setAttribute("disabled", true);
                }
            });
            document.querySelectorAll(".chapter-title").forEach((e) => {
                e.classList.remove("active");
            });
            currentChapterTitle.classList.add("active");

            editorSection.querySelectorAll(".container").forEach((element) => {
                element.classList.add("d-none");
            });
            editorSection.insertAdjacentHTML(
                "beforeend",
                `
      <div class="container h-100" id="chapter-editor-${chapterID}">
        <div class="title">
        <h1 id="chapterTitle" class="editor_chapterTitle" contenteditable="true" data-cid="${chapterID}" onclick="getChapterTitle(this)">Add Chapter title</h1>
        <hr class="solid">
        </div>
        <div class="editor"></div>
      </div>
      `
            );


            lettersCount[lettersCount.length] = [chapterID, 0];

            window["chapterEditor" + chapterID] = new Quill(
                "#chapter-editor-" + chapterID + " .editor", {
                    modules: {
                        toolbar: toolbarOptions,
                    },

                    theme: "snow",
                }
            );
            window["chapterEditor" + chapterID].on(
                "text-change",
                function(delta, oldDelta, source) {
                    let textLen = window["chapterEditor" + chapterID].getLength(),
                        editorFullContent1 = document.querySelector(
                            "#chapter-editor-" + chapterID + " .ql-editor"
                        ).innerHTML,
                        previewContainer = document.querySelector(
                            "#chapter-preview-" +
                            chapterID +
                            " .chapterPreviewContainer"
                        ),
                        chapterTitle = document.querySelector(
                            "#chapter-title-" + chapterID + " input"
                        ).value,
                        oldDOM = [];
                    let x = `<h1 class="cht"  id="cht-${chapterID}">${chapterTitle}</h1> </br></br></br></br></br></br>`
                    console.log(x);
                    editorFullContent = x + editorFullContent1;
                    previewContainer.querySelectorAll(".preview").forEach(e => {
                        let childrenLen = e.children.length,
                            i = 0;
                        if (childrenLen > 0) {
                            for (i; childrenLen > i; i++) {
                                oldDOM.push(e.children[i]);
                            }
                        }
                    });
                    let tmp = document.createElement('div');
            tmp.innerHTML = editorFullContent;
            let paragraphs = Array.from(tmp.children)
            let newContent = "";
          
            paragraphs.forEach(el => {
                let karim = el.firstElementChild; 
             
             
                if( karim == null ){ 
                             if(el.tagName == "P" || el.tagName == "PRE"  ){  
                                 let p =el ;
                                 let sentences = p.innerHTML.split(" ");
                                 let newParagraph = "";
                                 let currentParagraph = "";
                                 let currentParagraphLength = 0;
                                 sentences.forEach(s => {
                                     let sentenceLength = s.length;
             
                                     let y = sentenceLength + currentParagraphLength;
                                     console.log(y);
                                     if (y < 49 ) {
                                     currentParagraph += s + " ";
                                     currentParagraphLength += sentenceLength + 1;
                                     y = 0;
                                     } else {
                                     newParagraph += `<${el.tagName} class="${el.classList[0]}"> ` + currentParagraph + `</${el.tagName}>`;
                                     currentParagraph = s + " ";
                                     currentParagraphLength = sentenceLength + 1;
                                     }
                                 });
                                 newParagraph += `<${el.tagName} class="${el.classList[0]}"> ` + currentParagraph + `</${el.tagName}>`;
                                 newContent += newParagraph;
                             }else{
                                 newContent += el.outerHTML;
                             }
                         }else{
                             console.log(el.innerHTML);
                             newContent += el.outerHTML;
                         }
                         });
            console.log(newContent);

          
            editorFullContent = newContent;
            // console.log(editorFullContent);

            previewContainer.innerHTML = "";
                    previewContainer.innerHTML = "";
                    appendChunksToPages(
                        getNodeChunks(editorFullContent, oldDOM),
                        previewContainer,
                        chapterTitle
                    );
                    document.querySelectorAll(".chapter-pageNum").forEach((e, i) => {
                        e.innerHTML = i + 1;
                    });

                    for (let i = 0; lettersCount.length > i; i++) {
                        if (lettersCount[i][0] == chapterID) {
                            lettersCount[i][1] = textLen;
                            break;
                        }
                    }
                    calcChapters(lettersCount);
                }
            );

            chapterContainerElement.insertAdjacentHTML(
                "beforeend",
                `
      <div class="chapter" id="chapter-preview-${chapterID}">
          
          <div class="chapterPreviewContainer"></div>
      </div>
      `
            );
        }
    });

    // sidebar interactions
    chapterList.addEventListener("click", function(e) {
        // delete btn
        if (e.target.matches(".fa-trash")) {
            if (!confirm("Are you sure you want to delete this chapter?")) {
                return;
            }
            let currentChapterTitle = e.target.closest(".chapter-title"),
                chapterNum = currentChapterTitle.getAttribute("data-chapter-num");
            currentChapterTitle.remove();
            document.getElementById("chapter-editor-" + chapterNum).remove();
            document.getElementById("chapter-preview-" + chapterNum).remove();

            let chapterEditor = document.querySelectorAll(
                ".editor-section .container"
            );
            document.querySelectorAll(".chapter-title").forEach((e, i) => {
                let theNum = i + 1;
                e.querySelector(".chapterNumber").innerText = theNum + ".";

                if (theNum == 1) {
                    e.classList.add("active");
                    chapterEditor[0].classList.remove("d-none");
                } else {
                    e.classList.remove("active");
                    chapterEditor[i].classList.add("d-none");
                }
            });

            for (let i = 0; lettersCount.length > i; i++) {
                if (lettersCount[i][0] == chapterNum) {
                    lettersCount.splice(i, 1);
                    break;
                }
            }
            calcChapters(lettersCount);

        }

        // edit btn
        if (e.target.matches(".fa-pen")) {
            let currentInput = e.target
                .closest(".input_field")
                .getElementsByTagName("input")[0];
            currentInput.removeAttribute("disabled");
            currentInput.focus();
            currentInput.addEventListener('keyup', function() {

                document.getElementById('chapterTitle').innerText = currentInput.value;
                let chapterID = currentInput.getAttribute("data-cid");
                console.log(chapterID);
                if(document.getElementById( `cht-${chapterID}`)){
                    document.getElementById( `cht-${chapterID}`).innerText = currentInput.value;
                }
            })
        }

        // chapter input change
        if (e.target.matches(".chapter-title input")) {
            let scrollToElement = document.getElementById('scrollToElement');
            if (scrollToElement) {
                scrollToElement.removeAttribute('id');
            }
          
            let $this = e.target,
                chapterNum = $this
                .closest(".chapter-title")
                .getAttribute("data-chapter-num");
            $this.addEventListener("keyup", function() {
                document.querySelector(
                    "#chapter-editor-" + chapterNum + " h1"
                ).innerText = this.value;
                // document.querySelector(
                //     "#chapter-preview-" + chapterNum + " .chapterH1"
                // ).innerText = this.value;
            });
            // console.log(document.querySelector("#chapter-preview-"+chapterNum).firstElementChild.firstElementChild);
            if(document.querySelector("#chapter-preview-"+chapterNum).firstElementChild.firstElementChild){
                document.querySelector("#chapter-preview-"+chapterNum).firstElementChild.firstElementChild.scrollIntoView({block:"center"});
            }
            $this.addEventListener("focusout", function() {
                this.setAttribute("disabled", true);
            });

            if ($this.hasAttribute("disabled")) {
                document.querySelectorAll(".editor-section .container").forEach((e) => {
                    e.classList.add("d-none");
                });
                document.querySelectorAll(".chapter-title").forEach((e) => {
                    e.classList.remove("active");

                });
                let currentClickedChapter = $this.closest(".chapter-title");
                currentClickedChapter.classList.add("active");
                document
                    .querySelector(`#chapter-editor-${chapterNum}`)
                    .classList.remove("d-none");
            }
        }

        // Accordion chapter title
        if (e.target.matches(".accordion-button")) {
            let $this = e.target;
            $this.addEventListener("focusout", function() {
                this.setAttribute("disabled", true);
            });
        }
    });

    let firstChapterTitleInput = document.querySelector(".chapter-title input");
    firstChapterTitleInput.addEventListener("keyup", (event) => {
        if (event.code === "Enter") {
            firstChapterTitleInput.setAttribute("disabled", true);
        }
    });

});


///////////////////////////////

function getNodeChunks(htmlDocument, oldDOM) {
    let offscreenDiv = document.querySelector("#js_offscreenPreview .preview");
    offscreenDiv.innerHTML = htmlDocument;
    offscreenRect = offscreenDiv.getBoundingClientRect();
    let chunks = [];
    let newchunks = [];

    let currentChunk = [];
// console.log(offscreenDiv.innerHTML);
    // re init the scroll effect.. 

    for (let i = 0; i < offscreenDiv.children.length; i++) {
        if (oldDOM.length > 0) {
            if (oldDOM[i]) {
                if (offscreenDiv.children[i].innerHTML != oldDOM[i].innerHTML) {
                    offscreenDiv.children[i].id = "scrollToElement";



                }
            }
        }


    }
  

    for (let i = 0; i < offscreenDiv.children.length; i++) {



        let current = offscreenDiv.children[i];
        let currentRect = current.getBoundingClientRect();
       
        currentChunk.push(current);
        // console.log(current);
        // console.log(current);
        if (currentRect.bottom > offscreenRect.bottom) {
            // current element is overflowing offscreenDiv, remove it from current chunk
            currentChunk.pop();
            // remove all elements in currentChunk from offscreenDiv
            currentChunk.map((elem) => elem.remove());
            // since children were removed from offscreenDiv, adjust i to start back at current eleme on next iteration
            i -= currentChunk.length;
            // push current completed chunk to the resulting chunklist
            chunks.push(currentChunk);
            // initialise new current chunk
            currentChunk = [current];
            offscreenRect = offscreenDiv.getBoundingClientRect();
           
            
            
           
        }
        // break;
    }
    // currentChunk may not be empty but we need the last elements
    if (currentChunk.length > 0) {
        currentChunk.forEach((elem) => elem.remove());
        chunks.push(currentChunk);
    }
    
    return chunks;
}

function appendChunksToPages(chunks, rootContainer, chapterTitle) {
    let container = rootContainer,
        i = 0;
// console.log(chunks[0][7].innerText.length); 
    chunks.forEach((chunk) => {
        container.innerHTML += `
      <div class="chapter-page">
          <div class="preview preview_${i}"> </div>
          <div class="chapter-pageNum text-center"> </div>
      </div>
      `;
        let content = container.querySelector(".preview_" + i);

        chunk.forEach((elem) => content.appendChild(elem));
        i++;
    });

    let scrollToElement = document.getElementById('scrollToElement');
    if (scrollToElement) {
        scrollToElement.parentElement.parentElement.scrollIntoView({
            block: "center"
        });
        localStorage.setItem("scrollToY", scrollToElement.parentElement.parentElement.offsetTop);
    } else {
        let offsetY = localStorage.getItem("scrollToY");
        let containerView = document.querySelector(".containerView");
        containerView.scrollTo(0, offsetY);
    }
}

function calcChapters(arr, mobile = false) {
    let max = 0;
    for (let i = 0; arr.length > i; i++) {
        if (arr[i][1] > max) {
            max = arr[i][1];
        }
    }
    if (mobile == false) {
        arr.forEach(e => {
            let len = (e[1] / max) * 100;
            document.querySelector(
                "#chapter-title-" + e[0] + " .progressbar-val"
            ).style.width = len + "%";
        });
    } else {
        arr.forEach(e => {
            let len = (e[1] / max) * 100;
            document.querySelector(
                "#chapter-accordion-" + e[0] + " .progressbar-val"
            ).style.width = len + "%";
        });
    }
}


// New  Version
function accordionClick(e) {
    const arrow = document.querySelectorAll(".a-down");
    const accordionInput = e.currentTarget.querySelector(".accordion-button");
    const accordions = document.querySelectorAll(".accordion-item");
    const hand = document.querySelector(".hand");
    let openAccordion = false;

    accordions.forEach(function(accordion) {
        const currentArrow = accordion.querySelector(".a-down");
        const currentAccordionInput = accordion.querySelector(".accordion-button");
        if (!currentAccordionInput.classList.contains("collapsed")) {
            openAccordion = true;
            currentArrow.classList.remove("fa-angle-down");
            currentArrow.classList.add("fa-angle-up");
        } else {
            currentArrow.classList.remove("fa-angle-up");
            currentArrow.classList.add("fa-angle-down");
        }
    });

    if (openAccordion) {
        arrow.forEach(function(e) {
            e.classList.remove("d-none");
        });
        hand.style.display = "none";
    } else {
        arrow.forEach(function(e) {
            e.classList.add("d-none");
        });
        hand.style.display = "block";
    }
};


var requiredChapter;
var requiredPreviewTitle;

function getChapterTitle(clickedChapter) {
    clickedChapter.setAttribute("contenteditable", true);

    let clickedChapterTitle = clickedChapter.innerText;
    let chapters = document.querySelectorAll('input.w-100');
    chapters.forEach(chapter => {
        if (chapter.value == clickedChapterTitle) {
            requiredChapter = chapter;
        }
    });

    let chapterPreviewTitle = document.querySelectorAll('.chapterH1');
    chapterPreviewTitle.forEach(chapterPreviewTitle => {
        if (chapterPreviewTitle.innerText == clickedChapterTitle) {
            requiredPreviewTitle = chapterPreviewTitle;
        }
    });


    clickedChapter.addEventListener("keyup", (event) => {
        if (event.keyCode === 13 || event.code === "Enter") {
            clickedChapter.setAttribute("contenteditable", false);
        } else {
            requiredChapter.value = clickedChapter.innerText;
        }
        let cid = requiredChapter.dataset.cid;
        if(document.getElementById(`cht-${cid}`)){
            document.getElementById( `cht-${cid}`).innerText =  clickedChapter.innerText;
        }
    })
}