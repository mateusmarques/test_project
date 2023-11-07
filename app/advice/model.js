import { Model } from 'objection';

class Advice extends Model {
  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
    this.date = new Date(this.date).toISOString();
  }
  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.date = new Date(this.date).toISOString();
  }

  static get tableName() {
    return 'advices';
  }
}

const insertAdvice = async (props) => {
  return Advice.query()
    .insert(props)
    .onConflict('api_id')
    .merge({
      updatedAt: new Date().toISOString(),
    })
    .returning('*');
};

export { Advice as default, insertAdvice };
