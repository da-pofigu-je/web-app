import React, { Component } from "react";
import Recipe from "../../models/recipe";
import IngredientAmountRow from "./IngredientAmountRow";
import SelectIngredient from "./SelectIngredient";
import Ingredient from "../../models/ingredient";
import IngredientAmount from "../../models/ingredientAmount";
import IngredientRepository from "../../models/ingredientRepository";

const ingredients = IngredientRepository.getAll();

export interface IProps {
    recipe: Recipe;
    onCancel: () => any;
    onAddOrSave: (recipe: Recipe) => any;
}

interface IState {
    ingredientAmounts: IngredientAmount[];
}

export default class RecipeForm extends Component<IProps, IState> {
    private nameRef = React.createRef<HTMLInputElement>();
    private descriptionRef = React.createRef<HTMLTextAreaElement>();

    constructor(props: IProps) {
        super(props);

        this.state = {
            ingredientAmounts: props.recipe.ingredients,
        };
    }

    public render = () => {
        const { onCancel, recipe } = this.props;

        return (
            <form>
                <label htmlFor="ingredientName">Название</label>
                <input
                    defaultValue={recipe.name}
                    type="text"
                    className="form-control"
                    id="ingredientName"
                    placeholder="Название рецепта"
                    ref={this.nameRef}
                    required={true}
                />
                <label htmlFor="ingredientDescription">Описание</label>
                <textarea
                    defaultValue={recipe.description}
                    className="form-control"
                    id="ingredientName"
                    placeholder="Описание рецепта"
                    ref={this.descriptionRef}
                    required={true}
                />
                <SelectIngredient onAdd={this.handleAddIngredient} ingredients={ingredients} />
                {this.renderIngredientRows()}
                <button type="button" className="btn btn-primary add-recipe-btn" onClick={this.handleAddOrSave}>
                    {recipe.id ? "Сохранить рецепт" : "Добавить рецепт"}
                </button>
                <button type="button" className="btn btn-danger ml-4" onClick={onCancel}>
                    Закрыть
                </button>
            </form>
        );
    }

    private handleChangeAmountRow = (ingredientAmount: IngredientAmount, newAmount: number) => {
        ingredientAmount.amount = newAmount;
    }

    private handleDeleteRow = (ingredientAmount: IngredientAmount) => {
        const newAmounts = this.state.ingredientAmounts.filter(ia => ia != ingredientAmount);
        this.setState({
            ingredientAmounts: newAmounts
        });
    }

    private renderIngredientRows = () => {
        const rows = this.state.ingredientAmounts
            .filter(ia => ia.ingredient != null)
            .map(ia => (
                <IngredientAmountRow
                    key={ia.ingredient!.name}
                    ingredientAmount={ia}
                    onDelete={() => this.handleDeleteRow(ia)}
                    onChange={a => this.handleChangeAmountRow(ia, a)}
                />
            ));

        return rows;
    }

    private handleAddIngredient = (ingredient: Ingredient | null) => {
        const newAmounts = [...this.state.ingredientAmounts];
        newAmounts.push({ ingredient, amount: 0 });

        this.setState({
            ingredientAmounts: newAmounts
        });
    }

    private handleAddOrSave = () => {
        if (!this.nameRef.current || !this.nameRef.current.value) {
            return;
        }

        const { onAddOrSave } = this.props;
        const recipe: Recipe = new Recipe();
        recipe.name = this.nameRef.current.value;
        recipe.description = (this.descriptionRef.current && this.descriptionRef.current.value) || "";
        recipe.ingredients = [...this.state.ingredientAmounts];
        onAddOrSave(recipe);
    }
}
