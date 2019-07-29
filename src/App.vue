<template>
<div id="app" class="mb-5">
    <div class="container">
      <div class="jumbotron text-center">
        <h1>Расходы и доходы домашних хозяйств</h1>
      </div>
      <div class="row">
        <div class="col-sm-4">
          <div class="card mb-2">
            <div class="alert alert-success m-0">Доход</div>
            <div class="card-body">
              <div class="mb-2">
                <div class="row">
                  <div class="col-sm-8">
                    <label for="message">Напоминание:</label>
                    <input 
                      type="text"
                      class="form-control form-control" 
                      id="message"
                      v-model="income.message"
                    >
                  </div>
                  <div class="col-sm-4">
                    <label for="summ">Сумма:</label>
                    <input
                      type="text"
                      class="form-control form-control"
                      id="summ"
                      v-model="income.summ"
                    >
                  </div>
                </div>
                
              </div>
              <button type="button" class="btn btn-success" @click="onAddIncome()">Добавить</button>
            </div> 
          </div>
          <div class="card mb-2">
            <div class="alert alert-warning m-0">Затраты</div>
            <div class="card-body">
              <div class="mb-2">
                <div class="row">
                  <div class="col-sm-8">
                    <label for="e_message">Напоминание:</label>
                    <input type="text" class="form-control form-control" id="e_message" v-model="expenses.message">
                  </div>
                  <div class="col-sm-4">
                    <label for="e_summ">Сумма:</label>
                    <input type="text" class="form-control form-control" id="e_summ" v-model="expenses.summ">
                  </div>
                </div>
              </div>
              <button type="button" class="btn btn-success" @click="onAddExpenses()">Добавить</button>
            </div> 
          </div>
        </div>
        <div class="col-sm-8">
          <div>
            <!-- The Modal -->
            <div class="modal fade" id="myModal">
              <div class="modal-dialog">
                <div class="modal-content">
                
                  <!-- Modal Header -->
                  <div class="modal-header">
                    <h4 v-if="target.type" class="modal-title">Доход</h4>
                    <h4 v-else class="modal-title">Затраты</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                  </div>
                  
                  <!-- Modal body -->
                  <div class="modal-body">
                    <div class="row">
                      <div class="col-sm-8">
                        <label for="message">Напоминание:</label>
                        <input 
                          type="text"
                          class="form-control form-control" 
                          id="message"
                          ref="message"
                          v-model="target.message">
                      </div>
                      <div class="col-sm-4">
                        <label for="summ">Сумма:</label>
                        <input
                          type="text"
                          class="form-control form-control"
                          id="summ"
                          ref="summ"
                          v-model="target.summ">
                      </div>
                    </div>
                  </div>
                  
                  <!-- Modal footer -->
                  <div class="modal-footer">
                    <button 
                      type="button"
                      class="btn btn-warning" 
                      data-dismiss="modal"
                      @click="onChange()"
                    >Change</button>

                    <button 
                      type="button"
                      class="btn btn-dark"
                      data-dismiss="modal"
                      @click="onDelete()"
                    >Delete</button>

                    <button
                      type="button"
                      class="btn btn-danger"
                      data-dismiss="modal"
                    >Close</button>
                  </div>
                  
                </div>
              </div>
            </div>

            <div class="container p-0">
              <div class="row">
                <div class="col">
                  <div class="alert alert-success text-center">
                    <div>Доход</div>
                    <div>{{ getAllSumm.income }}</div>
                  </div>
                </div>
                <div class="col">
                  <div class="alert alert-warning text-center">
                    <div>Затраты</div>
                    <div>{{ getAllSumm.expenses }}</div>
                  </div>
                </div>
                <div class="col">
                  <div class="alert alert-primary text-center">
                    <div>Баланс</div>
                    <div>{{ getAllSumm.balance }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="container p-0">
              <div class="row">
                <div class="col-sm-12">
                  <div class="list-group">
                    <button 
                      v-for="item in items"
                      :key="item.id"
                      type="button" 
                      class="list-group-item list-group-item-action"
                      :class="[ item.type ? 'list-group-item-success' : 'list-group-item-warning']"
                      @click="openDialog(item)"
                      data-toggle="modal" data-target="#myModal"
                    >
                      <span>
                        {{ item.message }}
                      </span>
                      <div class="float-sm-right">
                        {{ item.summ }}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data: function () {
    return {
      income: { message: "", summ: "", type: 1 },
      expenses: { message: "", summ: "", type: 0 },
      target: { id: 0, message: "", summ: 0, type: 1 },
      items: [],
    }
  },
  computed: {
    getAllSumm() {
      let income = 0;
      let expenses = 0; 
      let balance = 0;
      this.items.forEach((item) => {
        if (item.type) {
          income += (item.summ - 0);
        } else {
          expenses += (item.summ - 0);
        }
      });

      balance = income - expenses;

      return { income, expenses, balance };
    }
  },
  methods: {
    openDialog(item) {
      this.target = item;
    },

    async onChange() {
      let id = this.target.id;
      let res = await this.$services.messages.patch(id, this.target);
      this.getAllItems();
    },

    async onDelete() {
      await this.$services.messages.remove(this.target.id);
      this.getAllItems();
    },

    async onAddIncome() {
      let res = await this.$services.messages.create(this.income);
      this.getAllItems();
      this.income.message = "";
      this.income.summ = "";
    },

    async onAddExpenses() {
      let res = await this.$services.messages.create(this.expenses);
      this.getAllItems();
      this.expenses.message = "";
      this.expenses.summ = "";
    },

    async getAllItems() {
      let res = await this.$services.messages.find();
      this.items = res;
    }
  },
  mounted() {
    this.getAllItems();
  }

}
</script>

<style>
</style>
