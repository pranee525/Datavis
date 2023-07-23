import { Component, OnInit,ViewChild } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { R3Identifiers } from '@angular/compiler';
import { DataTree } from '../data-tree';
import {MatAccordion} from '@angular/material/expansion';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from 'src/environments/environment';
import { concat } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { MatTabGroup } from '@angular/material/tabs';
import { fn } from '@angular/compiler/src/output/output_ast';

import { ClsTree } from '../cls-tree';
import { MatPaginator } from '@angular/material/paginator';





@Component({
  selector: 'app-full-tree',
  templateUrl: './full-tree.component.html',
  styleUrls: ['./full-tree.component.css']
})
export class FullTreeComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;


  visData: any = [];

  mainDiv: any = [];
  refDiv: any = [];
  currentMainDiv = 0;
  filterSelection: any = [];
  keyList: any = [];
  cardsList: any = [];
  savePreviousList: any = [];
  panelOpenState = false;
  searchedRow:any=[];
  searchedLevel=0;
  searchtermback:any=''
  searchrefback:any=''

  objectKeys = Object.keys;
  colorPallet1:any=["#E2EDEB","#E0F3F7","#B8DBDE","#ABDAE2","#CEEDED","#7FC6D7","#F5F8F9","#DFEEF3","#C9E1E6",
  "#CEEAF6","#E2F1F7","#C4E2EA","#DAF1FE","#C4E5FB","#9BC7EC","#AFD6F8","#C1DDF3","#D1EAF7","#B5E4F6"]

  
  colorPallet:any=["#97C4A7","#8BDBEC","#C9D2C2","#E8C8ED","#C4E0C5","#7FC6D7","#dae5e4","#EFE2E7","#D7D6AC",
  "#ECDBCB","#C6AFEC","#C4E2EA","#DAF1FE","#C4E5FB","#9BC7EC","#AFD6F8","#C1DDF3","#D1EAF7","#B5E4F6"]

  constructor(private http: HttpClient,   private route: ActivatedRoute,
    private router: Router  ) { }

  ngOnInit(): void {


    var getTreeInfo:any=localStorage.getItem("buildTree");
    console.log(JSON.parse(getTreeInfo),"got from local storage")

    var searchTerm='';

    const treeData =  JSON.parse(getTreeInfo);
    var queryString='';
    if(treeData.filename!='')
  {
      queryString="filename='"+treeData.filename+ "'";
  }
  if(treeData.chaptername!=''){
    queryString+=" and chaptername='"+treeData.chaptername+"'";
  }
  if(treeData.searchTerm!=''|| treeData.refTerm!=''){/// <reference path="" />
    
    if(treeData.searchTerm!=''){
      searchTerm=treeData.searchTerm;
      this.searchtermback=treeData.sterm!=""?treeData.sterm:searchTerm;
    queryString+=" and ANY() LIKE '%"+treeData.searchTerm+"%'";
    }else if(treeData.refTerm!=''){
      searchTerm=treeData.refTerm;
      this.searchrefback=treeData.sref!=""?treeData.sref:searchTerm;
      queryString+=" and ANY() LIKE '%"+treeData.refTerm+"%'";
    }
  }




    //console.log(fName);
    var query="select * from JoinedSchema where "+queryString;

    console.log(query,"The current query")
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('root:Forgot@12')
      })
    };
    this.http.post<any>(environment.dbUrl, {
      command: query
    }, httpOptions).subscribe(data => {
      //this.postId = data.id;

      this.visData = JSON.stringify(data.result);
      this.visData = this.visData.replaceAll("@", "");//.replaceAll("/","//");

      this.visData = JSON.parse(this.visData)



      //  this.visData= this.visData.map((el:any) => 
      //      <DataTree>{context:el.context,
      //     isActive:el.isActive,
      //     reference:el.reference,
      //     reference_end:parseInt( el.reference_end),
      //     reference_start:parseInt(el.reference_start),
      //     rel:el.rel,
      //     rfc:el.rfc,
      //     resource:el.resource,
      //     rid:el.rid,
      //     toc1:el.toc1,
      //     toc2:el.toc2,
      //     toc3:el.toc3,
      //     toc4:el.toc4,
      //     toc5:el.toc5,
      //     toc6:el.toc6,
      //     toc7:el.toc7,
      //     toc8:el.toc8,
      //     toc9:el.toc9,
      //     toc10:el.toc10,
      //     toc11:el.toc11,
      //     toc12:el.toc12


      //     //this.refDiv.push(dObj);
      //   });

      this.mainDiv = this.visData.reduce(function (r: any, a: any) {
        r[a.toc1] = r[a.toc1] || [];
        r[a.toc1].push(a);
        return r;
      }, Object.create(null));



      console.log(this.mainDiv,"The main Div")
      this.savePreviousList.push(this.mainDiv);



      //  this.mainDiv = this.visData;

      // let uni_toc1=this.visData;//JSON.parse( this.visData);

      this.currentMainDiv = 1;

      //let uni_data = [...new Set(this.visData.map((item:any) => item.toc1))]; // [ 'A', 'B']
      this.filterSelection = this.mainDiv;

      
      

      const flatArray=[].concat(...this.visData)

      console.log(flatArray,"The flat array to find toc")



      for(var i=1;i<=12;i++){
        var buildToc="toc"+i

        var toc_level:string[]=flatArray.map(x=> x[buildToc]);
        console.log(toc_level)
        var this_row=toc_level.findIndex(a=>a.includes(searchTerm));
        console.log(flatArray [this_row],this_row,"the row")

        if(this_row!=-1){
          
         this.searchedRow=flatArray[this_row];
          this.searchedLevel=i;
          break;

        }

      }


      for(var i=1;i<this.searchedLevel;i++){

        var buildToc="toc"+i
        var ele=this.searchedRow[buildToc]
        this.gotoNextLevel(ele,this.currentMainDiv);
      }

      //this.mainDiv=uni_data;//.map((x:any)=>{x.toc1,x.reference});

      //   this.refDiv=this.visData.reduce(function (r:any, a:any) {
      //     r[a.toc1] = r[a.toc1] || [];
      //     r[a.toc1].push(a);
      //     return r;
      // }, Object.create(null));

      // this.mainDiv=this.visData.find(e=>{return e.toc1});


      // console.log(this.refDiv);
    })


  }

  showSelection(ele: any, currentDiv: number): void {

    // this.mainDiv=this.visData;
    var datadiv = this.mainDiv;
    const filData = Object.keys(datadiv).reduce(function (filtered: any, key: any) {
      if (key == ele) {
        filtered[key] = datadiv[key];

      }
      return filtered;
      //  if (this.mainDiv[key] > 1) filtered[key] = this.mainDiv[key];

    }, {});
    console.log(filData, "fildata")
    //this.filterSelection="";
    this.filterSelection = filData;
  }


  gotoNextLevel(ele: any, currentDiv: number): void {

    var nextToc = currentDiv + 1;
    var buildToc = "toc" + nextToc
    var curtoc = "toc" + currentDiv;
    console.log(curtoc, "This build toc")

    var refEle = "";

    var redDiv = this.visData.reduce(function (r: any, a: any) {

      //console.log(a[buildToc],"buildToc being used")
      if (a[curtoc] == ele) {
        refEle = a[buildToc];
        if (refEle != '') {
          r[a[buildToc]] = r[a[buildToc]] || [];
          r[a[buildToc]].push(a);
        }
      }
      return r;
    }, Object.create(null));

    // console.log(Object.keys(redDiv).length, "reddiv")
    if (Object.keys(redDiv).length == 0) {

      if (this.savePreviousList[currentDiv - 1] != null) {
        this.mainDiv = this.savePreviousList[currentDiv - 1];
        // this.savePreviousList= this.savePreviousList.splice(currentDiv-1,1);
        //this.cardsList.pop();

        console.log(this.mainDiv, "main div when no nex div")
        this.currentMainDiv = currentDiv;
        var datadiv = this.mainDiv
        refEle = ele;
        const filData = Object.keys(datadiv).reduce(function (filtered: any, key: any) {
          if (key == refEle) {
            filtered[key] = datadiv[key];

          }
          return filtered;
          //  if (this.mainDiv[key] > 1) filtered[key] = this.mainDiv[key];

        }, {});
        this.cardsList.splice(currentDiv - 1, 1)
        this.savePreviousList.splice(currentDiv - 1, 1)
        this.keyList.splice(currentDiv - 1, 1)
        this.filterSelection = filData;
      }
    }
    else {
      this.mainDiv = redDiv;

      this.currentMainDiv = currentDiv + 1;
      var datadiv = this.mainDiv
      const filData = Object.keys(datadiv).reduce(function (filtered: any, key: any) {
        if (key == refEle) {
          filtered[key] = datadiv[key];

        }
        return filtered;
        //  if (this.mainDiv[key] > 1) filtered[key] = this.mainDiv[key];

      }, {});
      this.keyList.push(ele);
      
      this.filterSelection = filData;
      this.savePreviousList.push(this.mainDiv);

    }
    this.loadTopDivs(ele, currentDiv)
    console.log(ele, "This ele is from main")

    console.log(refEle, "This ele is from selection")
    console.log(currentDiv, "This current div for top")
    console.log(this.keyList, "This keys list");
    console.log(this.cardsList, "This is cards list");
    //this.mainDiv = this.visData;
    //this.filterSelection="";

  }



  gotoPreviousLevel(ele: any, currentDiv: number): void {

    console.log(currentDiv,"The current div for prev")

    if (currentDiv > 1) {
      var prevToc = currentDiv - 1;
      var buildToc = "toc" + prevToc;
      var curToc = "toc" + currentDiv;
     // console.log(buildToc, "This build toc")
      // var curToc=currentDiv
      var refEle = "";

      if (prevToc == 1&& this.cardsList.length==1) {
        this.mainDiv = this.cardsList[0]
        this.cardsList = [];
        this.keyList = [];
        this.savePreviousList=[];
        this.savePreviousList.push(this.mainDiv);
        this.currentMainDiv = 1;
      }
      else {
      //  
      var prev2=prevToc-2;
       var prevToc1=prevToc>=this.savePreviousList.length? prev2:prevToc-1;
        this.mainDiv = this.savePreviousList[prevToc1];
       // this.mainDiv = this.savePreviousList.at(-1);
        console.log(this.savePreviousList,"saved previous list")
        console.log(prevToc1,"the token for previous lever")
        console.log(prevToc,"the token for previous lever")
        console.log(this.keyList,"The current keylist")
        // this.savePreviousList= this.savePreviousList.splice(currentDiv-1,1);
        //this.cardsList.pop();
        this.currentMainDiv = prevToc;
        var datadiv = this.mainDiv
        refEle = this.keyList.at(-1);
        console.log(refEle,"The last element")
        const filData = Object.keys(datadiv).reduce(function (filtered: any, key: any) {
          if (key == refEle) {
            filtered[key] = datadiv[key];

          }
          return filtered;
          //  if (this.mainDiv[key] > 1) filtered[key] = this.mainDiv[key];

        }, {});
        this.cardsList.pop();
        this.keyList.pop();
        this.savePreviousList.pop();
       console.log(filData,"The filled data")
        this.filterSelection = filData;
      }
    }

    //console.log(this.keyList, "This keys list");
    //console.log(this.cardsList, "This is cards list");
  }

  loadTopDivs(ele: string, currentDiv: number) {
    this.cardsList = [];

    for (var i = 0; i < currentDiv; i++) {
      if (this.savePreviousList[i] != null)
        this.cardsList.push(this.savePreviousList[i]);
    }

  }

  enableSpan(row:any){

    if(row.expand){
      row.expand=false;
    }
    else{
    row.expand = true;
    }
 }

 jumpBetweenLevels(filename:string,chaptername:string,searchTerm:string){
  var termStorage:ClsTree={chaptername:'',filename:'',treeType:2,refTerm:'',searchTerm:'',sterm:'',sref:''};

  termStorage.treeType=1;
  termStorage.filename=filename!=""?filename:"";
  termStorage.chaptername=chaptername!=""?chaptername:"";
  termStorage.searchTerm=searchTerm!=""?searchTerm:"";
  termStorage.refTerm=this.searchrefback!=""?this.searchrefback:"";
  termStorage.sterm=this.searchtermback!=""?this.searchtermback:"";


  
  localStorage.clear();

  console.log(termStorage,"the current search term")
  localStorage.setItem("buildTree",JSON.stringify(termStorage));

  
  this.router.navigate(['/fulltree', "" ]);
  
 }
 setTermStorage(filename:any){
  this.router.navigate(['/search', filename ]);
 }
 setRefTermStorage(filename:any){
  this.router.navigate(['/refsearch', filename ]);
 }

}
