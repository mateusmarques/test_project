import { Model } from 'objection';

class Advice extends Model {
  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
  $beforeInsert() {
    this.createdAt = new Date().toISOString();
  }

  static get tableName() {
    return 'advices';
  }
}

const insertAdvice = async (props) => {
  const toSave = {
    advice: props.advice,
    apiId: props.id,
  };
  return Advice.query()
    .insert(toSave)
    .onConflict('api_id')
    .merge({
      updatedAt: new Date().toISOString(),
    })
    .returning('*');
};

export { Advice as default, insertAdvice };
