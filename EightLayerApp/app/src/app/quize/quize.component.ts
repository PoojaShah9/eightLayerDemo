import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {count} from 'rxjs/operators/count';
import {ObjNgFor} from '../client-enterprise/myPipe';
//import {MdCheckbox} from '@angular2-material/checkbox';
import {Router} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormControl, FormGroup, FormArray, FormBuilder, Validators} from '@angular/forms';
import {ajaxGetJSON} from "rxjs/observable/dom/AjaxObservable";
import {yellow} from "@angular-devkit/core/src/terminal/colors";
import {el} from "@angular/platform-browser/testing/src/browser_util";


@Component({
  selector: 'app-quize',
  templateUrl: './quize.component.html',
  styleUrls: ['./quize.component.css']
})
export class QuizeComponent implements OnInit {
  public myForm: FormGroup;
  quizeData: any;
  showSpinner: boolean = false;
  entId: any;
  msg;
  any
  userID: any
  quizStatus = "Not Started"
  quizeQuestion: any;
  count = 0;
  myQuizquestion: any
  Qlength: any;
  answerData = [];
  option: any
  compareData: any;
  currentAns: any;
  myIndex: any;
  display = 'none';
  message: any;
  currectAnswer: any;
  currectAnswerdata: any
  currentType: any
  isValid: boolean = true;
  type2Data = [];
  finalLessonData: any
  finalLessonDataName: any;
  myValue: any;
  currentChapterCode: any
  selection;
  QuizScheduleId: any
  userLevel: any
  type2DynamicData: any;
  quizeIdData: any;
  isAvailable = true;
  redClassBool = true;
  finalType2Answers = []
  finalType2Index = []
  type2Index: any;
  questionSection: boolean = true;
  disableQuestion: boolean = false;
  isFound: boolean = true;
  private saveUsername: boolean = true;
  public data;
  ratingModelShow: boolean = false;
  ratingClicked: any;
  rating: number;
  id: number;
  submit: boolean;
  comments: any;
  type2Answer;
  p: number = 1;
  lesson_Name;
  hideIcon = false;
  quizeDate;
  chapterCode;
  attemptQue = 0;
  question = [];
  questionDisable = false;
  queDetail = [];
  selectedAns = [];
  remainQue = 0;
  ansChecked = [];
  constructor(private httpClient: HttpClient, private _fb: FormBuilder, private router: Router) {


  }

  // Quize start
  quizStart(quizScheduleId) {
    console.log("quizScheduleId = " + quizScheduleId);
    this.myIndex = !this.myIndex
    this.questionSection = false;
    this.showSpinner = true;
    this.userID = localStorage.getItem("userId");
    this.httpClient.put('https://2gs6fkutxh.execute-api.us-east-1.amazonaws.com/dev/reports/quizzes/' + this.entId + '/users/' + localStorage.getItem("Updated_user_id") + '/' + quizScheduleId + "_" + localStorage.getItem("Updated_user_id"),
      JSON.stringify({

        quiz_schedule_id: quizScheduleId,
        scheduled_status: "Running"

      }),
      {
        headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken")
        )
      }
    ).subscribe((data: any) => {
      this.httpClient.get('https://o9dzztjg31.execute-api.us-east-1.amazonaws.com/dev/schedules/questions/' + this.entId + '/' + quizScheduleId + '',
        {
          headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken"))
        }).subscribe(data => {
        this.quizeQuestion = data
        console.log("i am calling-------------------->",data);
        /*that is giving number of answer*/
        this.option = 0

        this.currentType = this.quizeQuestion.data[0].question_type;
        this.currentChapterCode = this.quizeQuestion.data[0].chapter_code;
        console.log()
        /*start show lessons*/
        this.showSpinner = true;
        this.entId = localStorage.getItem("enterpriseId");

        this.httpClient.get('https://g3052kpia0.execute-api.us-east-1.amazonaws.com/dev/chapters/' + this.currentChapterCode,
          {
            headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken"))
          }).subscribe(data => {

          let lessonData;
          lessonData = data
          console.log(lessonData);
          this.finalLessonData = lessonData.data.chapter_lesson
          this.finalLessonDataName = lessonData.data.chapters_name

          this.showSpinner = false;
          //this.Edata = Array.of(this.Edata);
        }, (error: any) => {

          console.log("error = " + error);

        })
        /*end show lessons*/

        if (this.currentType == "1") {

          this.isValid = true;
        } else {

          this.isValid = false;

        }
        for (data in this.quizeQuestion.data[0].question_options) {


          this.option = this.option + 1
          this.answerData[this.option - 1] = this.quizeQuestion.data[0].question_options[this.option - 1].name

        }

        /*this is give the answer*/

        this.Qlength = this.quizeQuestion.data.length;
        this.myQuizquestion = this.quizeQuestion.data[0].question;
        //this.quizStatus = "Running"
        this.showSpinner = false;
      }, (error: any) => {
        console.log("error in inner = " + error.message);
      })
      this.showSpinner = false;

    }, (error: any) => {
      console.log("error of enterprise = " + error.message);
      this.showSpinner = false;
    })
  }

  //for Question increment
  questionNext() {
    this.currentAns = '';
    this.entId = localStorage.getItem("enterpriseId");
    this.disableQuestion = false;
    this.display = 'none';
    this.count = this.count + 1;
    if (this.count >= this.Qlength) {
      this.userID = localStorage.getItem("userId");

      //for complete status
      this.showSpinner = true;
      this.httpClient.put('https://2gs6fkutxh.execute-api.us-east-1.amazonaws.com/dev/reports/quizzes/' + this.entId + '/users/' + localStorage.getItem("Updated_user_id") + '/' + this.QuizScheduleId + "_" + localStorage.getItem("Updated_user_id"),
        JSON.stringify({
          quiz_schedule_id: this.QuizScheduleId,
          scheduled_status: "Completed"
        }),
        {
          headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken")
          )
        }
      ).subscribe((data: any) => {
        console.log(data);
        this.ratingModelShow = true;
        /*questionsengagement*/

        this.httpClient.post('https://2gs6fkutxh.execute-api.us-east-1.amazonaws.com/dev/reports/' + this.entId + '/users/' + this.userID + '/quizzes/' + this.QuizScheduleId + '/questionsengagement',
          {},
          {

            headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken"))

          }).subscribe(data => {

          console.log("questionsengagement is calling==>", data)
          this.ratingModelShow = true;
          this.showSpinner = false;
        }, (error: any) => {

          console.log("error = " + error);

        })
        /* userlevel */

        this.httpClient.post('https://2gs6fkutxh.execute-api.us-east-1.amazonaws.com/dev/reports/' + this.entId + '/users/' + this.userID + '/quizzes/' + this.QuizScheduleId + '/userlevel',
          {},
          {
            headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken")
            )
          }
        ).subscribe((data: any) => {

          let userLevel
          userLevel = data;
          this.userLevel = userLevel.data.user_level
          console.log("userLevel is calling==>", this.userLevel);
          this.showSpinner = false;
          this.redClassBool = true;


        }, (error: any) => {

          console.log("error of enterprise == " + error.message);
        })


        this.showSpinner = false;

      }, (error: any) => {

        console.log("error of enterprise = " + error);
      });


      this.quizStatus = "Complete";
      let changeStatus = {
        "quiz_schedule_id": this.quizeData.data[0].quiz_schedule_id,
        "entid": parseInt(this.entId),
        "lessons_included": this.quizeData.data[0].lessons_included,
        "quiz_status": 1,
        "scheduled_date": this.quizeData.data[0].scheduled_date
      };
      console.log('changeStatus', changeStatus);
      this.httpClient.post('https://gvb0azqv1e.execute-api.us-east-1.amazonaws.com/dev/changequizestatus', changeStatus)
        .subscribe((response) => {
          this.hideIcon = true;
        });
      this.questionSection = true;

    } else {
      for(let i=0; i< this.question.length; i++) {
        this.attemptQue = this.attemptQue + 1;
        this.remainQue = this.Qlength -1;
        if(this.question[i] === this.quizeQuestion.data[this.count].question_code) {
          alert(this.question[i]);
          this.questionDisable = true;
        }
      }
      this.myQuizquestion = this.quizeQuestion.data[this.count].question
      //for options
      this.myIndex = !this.myIndex
      this.answerData = [];
      this.option = 0

      this.currentType = this.quizeQuestion.data[this.count].question_type;

      if (this.currentType == "1") {

        this.isValid = true

      } else {

        this.isValid = false
      }
      for (let data in this.quizeQuestion.data[this.count].question_options) {

        this.option = this.option + 1;
        this.answerData[this.option - 1] = this.quizeQuestion.data[this.count].question_options[this.option - 1].name

      }

    }

  }

  selectedAnswer(answer, index, target) {
    console.log("target", target);
    this.myValue = answer
    this.myIndex = index
    this.currentAns = answer
  }

  selectedAnswertype2(answer: string, isChecked, finalIndex) {
    this.type2Answer = answer;
    console.log("i = " + finalIndex);
    console.log("answer = " + answer);
    this.finalType2Answers.push(answer)
    this.finalType2Index.push(finalIndex)
    /*
      this.httpClient.post('https://36mxqyy77a.execute-api.us-east-1.amazonaws.com/dev/users/' + this.userID + '/questions/' + this.quizeQuestion.data[this.count].question_code + '/useranswers',
        JSON.stringify({
          "answer":
            ansObj
        }),
        {
          headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken")
          )
        }
      ).subscribe((data: any) => {

        this.display = 'block';
        this.showSpinner = false;

      }, (error: any) => {

        console.log("error of enterprise" + error);
      });
    */
    // console.log("answer: ", answer , "isChecked" , isChecked, "this.type2Data", this.type2Data);
    let index;
    if (this.type2Data.length === 0) {
      this.type2Data.push(answer);
      isChecked.target.checked = true;
    }
    else {
      const result = this.type2Data.find(function (element) {

        return element === answer;
      });


      if (result === 'undefined' || typeof result == "undefined") {
        this.type2Data.push(answer);
        isChecked.target.checked = true;
      } else {
        let index = this.type2Data.findIndex(x => x == answer);
        this.type2Data.splice(index, 1);
        isChecked.target.checked = false;
      }
    }
    console.log("this.type2Data: ", this.type2Data);
  }

  findIsChecked(value) {

    if (this.type2Data.length > 0) {
      const result = this.type2Data.find(function (element) {
        console.log('dddddddddddddddddddddddd',element);
        return element === value;
      });
      if (result === 'undefined' || typeof result == "undefined")
        return false;
      else
        return true;

    } else {
      return false;
    }
  }

  findIndexToUpdate(answer) {
    return answer === this;
  }


  submitAnswer() {
    let ansObj = {};
    if (this.type2Answer === undefined) {
      alert('Select Answer')
      this.disableQuestion = false;
    } else {
      this.showSpinner = true;

      //  if (this.currentAns) {

      this.disableQuestion = true;

      if (this.currentType == "1") {
        /*for type1 start*/
        let ansID = this.myIndex;
        ansObj[ansID] = this.currentAns;
        // this.queDetail = [{
        //   'index': ansID,
        //   'answer': this.currentAns,
        //   'que_code': this.quizeQuestion.data[this.count].question_code
        //
        // }];
        // this.selectedAns.push(this.queDetail);
        this.httpClient.post('https://36mxqyy77a.execute-api.us-east-1.amazonaws.com/dev/users/' + this.userID + '/questions/' + this.quizeQuestion.data[this.count].question_code + '/useranswers',
          JSON.stringify({
            "answer":
            ansObj
          }),
          {
            headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken")
            )
          }
        ).subscribe((data: any) => {
          this.display = 'block';

          /*for right answer*/
          this.httpClient.get('https://36mxqyy77a.execute-api.us-east-1.amazonaws.com/dev/chapters/' + this.quizeQuestion.data[this.count].chapter_code + '/questions/' + this.quizeQuestion.data[this.count].question_code + '/answers',
            {
              headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken"))
            }).subscribe(data => {

            console.log(data);
            this.currectAnswerdata = data

            this.currectAnswer = "";
            for (let ans in this.currectAnswerdata.data[0].answer) {

              this.currectAnswer = this.currectAnswerdata.data[0].answer[ans]
            }

            if (this.currectAnswer == this.currentAns) {

              this.message = "Correct Answer"
              this.currentAns = "";
            } else {

              this.message = "Incorrect Answer"
              this.currentAns = "";
            }


          }, (error: any) => {

            console.log("error = " + error);

          })

          this.showSpinner = false;

        }, (error: any) => {

          console.log("error of enterprise" + error);
        });
        /*for type1 end*/
      }
      else {
        /*type 2 solutions*/
        ansObj = {};
        this.httpClient.get('https://36mxqyy77a.execute-api.us-east-1.amazonaws.com/dev/chapters/' + this.quizeQuestion.data[this.count].chapter_code + '/questions/' + this.quizeQuestion.data[this.count].question_code + '/answers',
          {
            headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken"))
          }).subscribe(data => {
          console.log("type 2 data");
          this.compareData = data
          let obj1 = {}
          obj1 = this.compareData.data[0].answer

          console.log("saved answer = ", obj1);
          this.display = 'block';
          this.showSpinner = false;
          const answer1 = [];
          let obj2 = [];
          obj2 = this.type2Data
          console.log("inputed data", obj2)
          let wrong = 0;

          for (let key in obj1) {

            answer1.push(obj1[key]);

          }

          for (let i = 0; i < obj2.length; i++) {


            if (answer1.indexOf(obj2[i]) != -1) {
              console.log("found");
              this.isFound = false;
              this.currectAnswer = answer1;
            }
            else {

              console.log("not found");
              this.isFound = true;
              this.currectAnswer = answer1;
              wrong = wrong + 1

            }

          }
          if (wrong > 0) {

            this.message = "Incorrect Answer"

          } else {

            this.message = "Correct Answer"
          }
          /*for type2 start*/

          console.log("finalType2Answers", this.finalType2Answers, "index", this.finalType2Index);

          console.log("this.finalType2Answers.length", this.finalType2Answers.length);

          for (let i = 0; i < this.finalType2Index.length; i++) {

            for (let j = 0; j < this.finalType2Index.length; j++) {

              console.log(this.finalType2Index[i], this.finalType2Answers[j]);

              ansObj[this.finalType2Index[j]] = this.finalType2Answers[j]

            }

          }
          this.queDetail = [{
            'answer': ansObj,
            'que_code': this.quizeQuestion.data[this.count].question_code
          }];
          this.selectedAns.push(this.queDetail);
          /*type 2 save answer*/
          console.log("finallllllll  answerrr  = ", ansObj);
          this.httpClient.post('https://36mxqyy77a.execute-api.us-east-1.amazonaws.com/dev/users/' + this.userID + '/questions/' + this.quizeQuestion.data[this.count].question_code + '/useranswers',
            JSON.stringify({
              "answer":
              ansObj
            }),
            {
              headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken")
              )
            }
          ).subscribe((data: any) => {

            console.log("data", data);
            this.display = 'block';
            this.type2Data = [];
            this.finalType2Answers = [];
            this.finalType2Index = [];
            this.showSpinner = false;

          }, (error: any) => {

            console.log("error of enterprise" + error.message);
          });

        }, (error: any) => {

          console.log("error = " + error);

        })
        //---
        console.log("answer", ansObj)

//-----
      }
      this.question.push(this.quizeQuestion.data[this.count].question_code);
      console.log('qqqqqqqqqqqqqqqqqqqqqq', this.question);
    }

  }

  /* onChange(email: string, event: boolean) {

    const emailFormArray = <FormArray>this.myForm.controls.Type2options;
    console.log(event);
   if (event) {
      emailFormArray.push(new FormControl(email));
    } else {
      let index = emailFormArray.controls.findIndex(x => x.value == email)
      emailFormArray.removeAt(index);
    }
  }*/
  counter(i: number) {
    return new Array(i);
  }

  ngOnInit() {
    this.showSpinner = true;
    this.entId = localStorage.getItem("enterpriseId");
    this.httpClient.get('https://o9dzztjg31.execute-api.us-east-1.amazonaws.com/dev/schedules/quizzes/' + this.entId,
      {
        headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken"))
      }).subscribe(data => {
      console.log("quize data =====>", data);
      this.quizeData = data;
      this.chapterCode = this.quizeData.data[0].lessons_included[0];
      this.httpClient.get('https://g3052kpia0.execute-api.us-east-1.amazonaws.com/dev/chapters/' + this.chapterCode,
        {
          headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken"))
        }).subscribe(data => {
        let lessonData;
        lessonData = data;
        this.finalLessonData = lessonData.data.chapter_lesson
        this.finalLessonDataName = lessonData.data.chapters_name

        this.showSpinner = false;
        //this.Edata = Array.of(this.Edata);
      }, (error: any) => {

        console.log("error = " + error);

      });
      if (this.quizeData.status == "failed") {
        alert('you have no quiz scheduled right now..!');
      } else {
        this.QuizScheduleId = this.quizeData.data[0].quiz_schedule_id;
        this.lesson_Name = this.quizeData.data[0].lesson_Name;
        this.quizeDate = this.quizeData.data[0].scheduled_date;
        this.showSpinner = false;
      }
    }, (error: any) => {
      console.log("error = " + error.message);

    })

    this.userID = localStorage.getItem("Updated_user_id");
    console.log("this.userID", this.userID)
    this.httpClient.get('https://o9dzztjg31.execute-api.us-east-1.amazonaws.com/dev/schedules/userquizquestions/' + this.entId + '/' + localStorage.getItem("Updated_user_id"),
      {
        headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken"))
      }).subscribe(data => {
      console.log("data=============", data);
      this.quizeIdData = data;
      if (this.quizeIdData.data == "") {
        this.showSpinner = false;
      } else {
        this.showSpinner = false;
        this.quizStart(this.quizeIdData.data[0].quiz_schedule_id);

      }

    }, (error: any) => {

      console.log("error = " + error);

    })

    this.myForm = this._fb.group({
      Type2options: this._fb.array([])
    });
  }


  // testing(temp1:any) {

  // }
  showMyPop() {
    this.redClassBool = false;
  }

  hideQuizepopUp() {
    this.redClassBool = true;
  }

  ratingComponentClick(clickObj: any): void {
    this.ratingClicked = clickObj;
    this.userID = localStorage.getItem("Updated_user_id");
    this.entId = localStorage.getItem("enterpriseId");
    let obj = {
      "user_quiz_accessed_id": this.quizeData.data[0].quiz_schedule_id,
      "user_lesson_accessed_id": this.quizeData.data[0].lessons_included[0],
      "entid": parseInt(this.entId),
      "userid": this.userID,
      "lesson_rating": this.ratingClicked.rating,
      "comment": this.ratingClicked.comments
    };
    this.httpClient.post('https://gvb0azqv1e.execute-api.us-east-1.amazonaws.com/dev/rating', obj)
      .subscribe(data => {
        alert('Thank you for rating..');
      });
    if (this.ratingClicked.submit === true) {
      this.ratingModelShow = false;
    }

  }

  pageChanged(value) {
    this.p = value;
    this.count = value - 1;
    let check = this.question.includes(this.quizeQuestion.data[this.count].question_code);
    console.log('oooooooooooooooo', this.selectedAns);
    for(let i =0; i<this.selectedAns.length; i++) {
      if(this.selectedAns[i].que_code === this.quizeQuestion.data[this.count].question_code) {
          this.ansChecked = this.selectedAns[i].i;
          console.log('fffffffffffffffffffff', this.ansChecked);
      }
    }
    if(check === true) {
      this.questionDisable = true;
    } else {
      this.questionDisable = false;
    }
    this.answerData = [];
    this.option = 0;
    for (let data in this.quizeQuestion.data[this.count].question_options) {
      this.option = this.option + 1;
      this.answerData[this.option - 1] = this.quizeQuestion.data[this.count].question_options[this.option - 1].name;
    }

  }
}
