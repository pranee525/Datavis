import { Component, OnInit,ViewChild,inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { MatTabGroup } from '@angular/material/tabs';

import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { R3Identifiers } from '@angular/compiler';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from 'src/environments/environment';
import { fn } from '@angular/compiler/src/output/output_ast';

import { ClsTree } from '../cls-tree';
import { MatPaginator } from '@angular/material/paginator';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient,  private route: ActivatedRoute,
    private router: Router,public dialog:MatDialog) { }

   
    @ViewChild('tabs') tabGroup: MatTabGroup;
  availableOptions:any=[]
  chapterNames:any=[]
  bookName:string="";

  chipColor:any={color:"primary"}
  activeFileName="";

  activeSearchTerm="Kündigung";

  activeSearchTermRef="568 bgb";

  searchResultRef:any=[];

  searchResult:any=[];
  dataForSearchResult:any=[];
  
  dataForSearchResultRef:any=[];
  pageEvent :any;
  searchInContext:Boolean=true;
  searchInToc:Boolean=true;
  loadingSpinner:boolean=false;
  chapterFilter:any=[];
  selectedChapters:any=[];
   chapterrefFilter:any=[];
  selectedrefChapters:any=[];
  colorPallet1:any=["#E2EDEB","#E0F3F7","#B8DBDE","#ABDAE2","#CEEDED","#7FC6D7","#F5F8F9","#DFEEF3","#C9E1E6","#CEEAF6","#E2F1F7","#C4E2EA","#DAF1FE","#C4E5FB","#9BC7EC","#AFD6F8","#C1DDF3","#D1EAF7","#B5E4F6"]

  colorPallet:any=["#97C4A7","#8BDBEC","#C9D2C2","#E8C8ED","#C4E0C5","#7FC6D7","#dae5e4","#EFE2E7","#D7D6AC",
  "#ECDBCB","#C6AFEC","#C4E2EA","#DAF1FE","#C4E5FB","#9BC7EC","#AFD6F8","#C1DDF3","#D1EAF7","#B5E4F6"]
  ngOnInit(): void {


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('root:Forgot@12')
      })
    };
    this.http.post<any>(environment.dbUrl, {
      command: 'select distinct filename from JoinedSchema'
    }, httpOptions).subscribe(data => {

      this.availableOptions=data.result;
     console.log(data)
     
    })

    const fName = this.route.snapshot.paramMap.get('file');
    
    if(fName!=null){
      this.showChaptersForSelection(fName);
    }

    

  }

  ngAfterViewInit():void{
    const fSearchTerm=this.route.snapshot.paramMap.get('searchterm');
    
    const fSearchrefTerm=this.route.snapshot.paramMap.get('searchrefterm');
    
   
    
    if(fSearchTerm!=null){
    //  alert(fSearchTerm)
      this.gotoSearchTerm(fSearchTerm);
    }

    
    if(fSearchrefTerm!=null){
      this.gotoRefTab(fSearchrefTerm);
    }

  }
  onPageChange($event:any) {

    this.searchResult =  this.dataForSearchResult.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize);
  }


  onPageChangeRef($event:any) {

    this.searchResultRef =  this.dataForSearchResultRef.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize);
  }
  openDialog() {
    this.dialog.open(DashboardComponent);
  }

  showChaptersForSelection(fname:string){

    this.bookName=fname;
    this.activeFileName=fname;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('root:Forgot@12')
      })
    };
    this.http.post<any>(environment.dbUrl, {
      command: 'select distinct chaptername from JoinedSchema where filename="'+fname+'" order by chaptername asc'
    }, httpOptions).subscribe(data => {

      this.chapterNames=data.result;
     console.log(data)
    })

  }

  showSelectedFile(fname:string,chapter:string){


    this.router.navigate(['/tree', fname,chapter ]);

  }

  buildTreeforWord(searchTerm:string){
    this.loadingSpinner=true;
    var getTreeInfo:any=localStorage.getItem("buildTree");
    console.log(JSON.parse(getTreeInfo),"got from local storage")

    var query="select * from JoinedSchema where ANY() LIKE '%"+searchTerm+"%' order by rfc";
    
    //console.log(fName);
    if(this.searchInContext && this.searchInToc){
      query="select * from JoinedSchema where ANY() LIKE '%"+searchTerm+"%' order by rfc";
    }else if(this.searchInToc&&!this.searchInContext){
      query="select * from joinedSchema where toc1 like '%"+searchTerm+"%' or toc2 like '%"+searchTerm+"%' or toc3 like '%"+searchTerm+"%'"+
      " or toc4 like '%"+searchTerm+"%' or toc5 like '%"+searchTerm+"%' or toc6 like '%"+searchTerm+"%'"+
      " or toc7 like '%"+searchTerm+"%' or toc8 like '%"+searchTerm+"%' or toc9 like '%"+searchTerm+"%' or toc10 like '%"+searchTerm+"%'"+
      " or toc11 like '%"+searchTerm+"%' or toc12 like '%"+searchTerm+"%' order by rfc";
    }
    else if (!this.searchInToc&&this.searchInContext){
       query="select * from JoinedSchema where context LIKE '%"+searchTerm+"%' order by rfc";
    
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('root:Forgot@12')
      })
    };
    this.http.post<any>(environment.dbUrl, {
      command: query
    }, httpOptions).subscribe(data => {

      console.log(data,"The data from the search")

      this.searchResult=data.result;
      
      this.dataForSearchResult=data.result;

      var chapters=this.dataForSearchResult.map((x:any)=>x.chaptername);
      this.chapterFilter=[...new Set(chapters)];
      console.log(this.chapterFilter)
     this.searchResult= this.searchResult.sort((a:any,b:any)=> a.context.includes(searchTerm)?a-b:a.rfc-b.rfc 
      ).slice(0,10);
      this.loadingSpinner=false;


      //this.postId = data.id;
    });



    localStorage.clear();

    console.log(searchTerm,"the current search term")
    localStorage.setItem("buildTree",JSON.stringify(searchTerm));
   // this.router.navigate(['/fulltree', "abc" ]);
  }


  buildRefTreeforWord(searchTerm:string){

    //var getTreeInfo:any=localStorage.getItem("buildTree");
    //console.log(JSON.parse(getTreeInfo),"got from local storage")
   
    //console.log(fName);
    this.loadingSpinner=true;
    var query="select * from JoinedSchema where reference LIKE '%"+searchTerm+"%' order by rel";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('root:Forgot@12')
      })
    };
    this.http.post<any>(environment.dbUrl, {
      command: query
    }, httpOptions).subscribe(data => {

      console.log(data,"The data from the search")

      this.searchResultRef=data.result;
      this.dataForSearchResultRef=data.result;
      this.activeSearchTermRef=searchTerm;
      var chaptersref=this.dataForSearchResultRef.map((x:any)=>x.chaptername);
      this.chapterrefFilter=[...new Set(chaptersref)];
     this.searchResultRef= this.searchResultRef.sort((a:any,b:any)=> a.context.includes(searchTerm)?a-b:a.rfc-b.rfc 
      ).slice(0,10);

     // this.searchResultRef.sort((a:any,b:any)=> a.context.includes(searchTerm)?a>b:a.rfc>b.rfc 
      //);

      console.log(this.searchResultRef)
      this.loadingSpinner=false;
      //this.postId = data.id;
    });




    //localStorage.clear();

    //console.log(searchTerm,"the current search term")
   // localStorage.setItem("buildTree",JSON.stringify(searchTerm));
   // this.router.navigate(['/fulltree', "abc" ]);
  }

  setRefStorage(filename:string,chaptername:string,refName:string){

    var refStorage:ClsTree={chaptername:'',filename:'',treeType:2,refTerm:'',searchTerm:'',sterm:'',sref:''};

    refStorage.treeType=2;
    refStorage.filename=filename!=""?filename:"";
    refStorage.chaptername=chaptername!=""?chaptername:"";
    refStorage.searchTerm="";
    refStorage.refTerm=refName!=""?refName:"";
    refStorage.sref=this.activeSearchTermRef!=""?this.activeSearchTermRef:"";
    
    localStorage.clear();

    console.log(refStorage,"the current search term")
    localStorage.setItem("buildTree",JSON.stringify(refStorage));

    this.router.navigate(['/fulltree', "abc" ]);




  }

  setTermStorage(filename:string,chaptername:string,searchTerm:string,toc_level:string){

    var termStorage:ClsTree={chaptername:'',filename:'',treeType:2,refTerm:'',searchTerm:'',sterm:'',sref:''};

    termStorage.treeType=1;
    termStorage.filename=filename!=""?filename:"";
    termStorage.chaptername=chaptername!=""?chaptername:"";
    termStorage.searchTerm=searchTerm!=""?searchTerm:"";
    termStorage.refTerm=this.activeSearchTermRef!=""?this.activeSearchTermRef:"";
    termStorage.sterm=this.activeSearchTerm!=""?this.activeSearchTerm:"";


    
    localStorage.clear();

    console.log(termStorage,"the current search term")
    localStorage.setItem("buildTree",JSON.stringify(termStorage));

    if(searchTerm!=''&& toc_level==''){
      this.searchResult=[];
      this.gotoSearchTerm(searchTerm)
    }else {
    this.router.navigate(['/fulltree', "" ]);
    }
  }

  gotoRefTab(clickedTerm:any){
  
    this.tabGroup.selectedIndex=2;
    this.activeSearchTermRef=clickedTerm;
    this.buildRefTreeforWord(this.activeSearchTermRef);
  }

  gotoSearchTerm(searchTerm:any){
    this.tabGroup.selectedIndex=1;
    this.activeSearchTerm=searchTerm;
    this.searchInContext=true;
    this.searchInToc=true;
    this.buildTreeforWord(this.activeSearchTerm);
  }
  onSelection(e:any,v:any){
    this.selectedChapters=e.value;
    console.log(this.selectedChapters,v,"The selected Chapters")
    this.searchResult=this.dataForSearchResult;
   this.searchResult= this.searchResult.filter((e:any)=>e.chaptername.includes(this.selectedChapters));

    this.searchResult= this.searchResult.sort((a:any,b:any)=> a.context.includes(this.activeSearchTerm)?a-b:a.rfc-b.rfc 
      ).slice(0,10);
  }
  onRefSelection(e:any,v:any){
    this.selectedrefChapters=e.value;
    console.log(this.selectedrefChapters,v,"The selected Chapters ref")
    this.searchResultRef=this.dataForSearchResultRef;
   this.searchResultRef= this.searchResultRef.filter((e:any)=>e.chaptername.includes(this.selectedrefChapters));

   this.searchResultRef= this.searchResultRef.sort((a:any,b:any)=> a.context.includes(this.activeSearchTermRef)?a-b:a.rfc-b.rfc 
   ).slice(0,10);
      console.log(this.searchResultRef)

  }

}


