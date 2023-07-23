import { Component, OnInit,ViewChild } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { R3Identifiers } from '@angular/compiler';
import { DataTree } from '../data-tree';
import {MatAccordion} from '@angular/material/expansion';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-bottomup-vis',
  templateUrl: './bottomup-vis.component.html',
  styleUrls: ['./bottomup-vis.component.css']
})
export class BottomupVisComponent implements OnInit {
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


  objectKeys = Object.keys;


  constructor(private http: HttpClient,   private route: ActivatedRoute,
    private router: Router  ) { }

  ngOnInit(): void {

    const fName = this.route.snapshot.paramMap.get('file');
    console.log(fName);
    var query="select * from JoinedSchema where ANY() LIKE '%Altverträge%'";
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



      console.log(this.mainDiv)
      this.savePreviousList.push(this.mainDiv);



      //  this.mainDiv = this.visData;

      // let uni_toc1=this.visData;//JSON.parse( this.visData);

      this.currentMainDiv = 1;

      //let uni_data = [...new Set(this.visData.map((item:any) => item.toc1))]; // [ 'A', 'B']
      this.filterSelection = this.mainDiv;
      // console.log(this.refDiv)

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
        var prev2=prevToc-1;
       var prevToc1=prevToc>=this.savePreviousList.length? prev2:prevToc;
        this.mainDiv = this.savePreviousList[prevToc1];
        console.log(this.savePreviousList,"saved previous list")
        console.log(prevToc1,"the token for previous lever")
        console.log(prevToc,"the token for previous lever")

        // this.savePreviousList= this.savePreviousList.splice(currentDiv-1,1);
        //this.cardsList.pop();
        this.currentMainDiv = prevToc;
        var datadiv = this.mainDiv
        refEle = this.keyList[prevToc1];
        const filData = Object.keys(datadiv).reduce(function (filtered: any, key: any) {
          if (key == refEle) {
            filtered[key] = datadiv[key];

          }
          return filtered;
          //  if (this.mainDiv[key] > 1) filtered[key] = this.mainDiv[key];

        }, {});
        this.cardsList.pop();
        this.keyList.pop();

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

  buildTocSpan(row:any){
    console.log(row)
    localStorage.setItem("buildTree",JSON.stringify(row));
    this.router.navigate(['/fulltree', "abc" ]);


  }

  enableSpan(row:any){

    if(row.expand){
      row.expand=false;
    }
    else{
    row.expand = true;
    }
 }

}
